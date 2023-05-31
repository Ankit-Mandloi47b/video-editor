import React, { Component, createRef, useEffect, useRef, useState } from 'react';

// import Konva from 'konva';
// import { Stage, Layer } from 'react-konva';

// import { Stage, Sprite, Text } from 'react-pixi-fiber';
import { Stage, Sprite, Text, Container, Graphics } from '@pixi/react';
import { TextStyle, Texture } from 'pixi.js';


// Video
import SunSetVid from './assets/sunset1920.mp4'

import './editor.css'

import testObj, { EditableText } from './CommonComponents/EditableText';
import Player from './Player';

import { createJson } from './helper_functions';
import { TRANSITION_TYPES } from './constants';

// Third Party Imports 

import axios from 'axios';

// MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import IconButton from '@mui/material/IconButton';


import Draggable from 'react-draggable';
import { downloadContentFromUrl } from './helper_functions/download_content';
import { recordVideo } from './helper_functions/record_canvas_video';
import { RotatingTriangle } from './assets/svg';
import { postTextContent } from './services/apis';
// import DraggableText from './CommonComponents/DraggableText';

// import EditableText from './CommonComponents/EditableText';

export default class Editor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      textList: [],
      showTextList: [],
      selectedTextData: {},
      isTransforming: false,
      isPlaying: false,
      currentVideoPosition: 0
    }
  }

  // Refs
  vidRef = createRef()

  // Variables
  dataId = 0
  selectedTextIndex = null

  initTextData = {
    x: 0,
    y: 0,
    style: {
      background: '#0000',
      fontSize: 40,
      fontFamily: 'monospace',
      fill: '#000000',
      fontStyle: 'normal',
      align: 'center',
      textDecoration: 'normal'
    },
    opacity: 1,
    draggable: true,
    interactive: true,
    buttonMode: true,
    dataId: 0,
    // selected: false,
    // isEditing: false,
    from: 0,
  }

  componentDidMount() {
    testObj.hook = this.onDragEnd
  }

  playPause = () => {
    if (this.vidRef.current.paused) {
      this.setState({ isPlaying: true })

      this.vidRef.current.play();
      setTimeout(() => {
        const canvas = document.getElementById('my-Canvas')
        const recording = recordVideo(canvas, 2000 || this.vidRef.current.duration * 1000)
        recording.then(url => {
          downloadContentFromUrl(url)

          // alert('clicked')
        }).catch(err => {
          console.log('errlrr', err)
        })
      }, 0)

    }
    else {
      this.setState({ isPlaying: false })
      this.vidRef.current.pause();
    }
  }

  generateNewTextProps = () => ({
    ...this.initTextData,
    text: `Text${this.dataId}`,
    dataId: this.dataId++,
  })

  // getSelectedText = () => this.state.selectedTextData

  changeSelectedTextProperties = () => this.setState((s) => ({ selectedTextData: s.textList[this.selectedTextIndex] }))

  changeSelectedTextIndex = index => { this.selectedTextIndex = index; this.changeSelectedTextProperties(index) };

  addText = () => {
    const newTextProps = this.generateNewTextProps()

    this.selectedTextIndex = this.state.textList.length;
    const newList = [...this.state.textList, newTextProps]

    this.setState({ textList: newList, selectedTextData: newTextProps })
  }

  onDragEnd = (x, y) => {
    if (this.selectedTextIndex === null) return

    const element = {
      ...this.state.selectedTextData,
      x,
      y,
    }

    const newList = [...this.state.textList]
    newList.splice(this.selectedTextIndex, 1, element)

    this.setState({ textList: newList })

  }

  editSelectedTextProperties = data => {
    if (this.selectedTextIndex === null) return;

    const newList = [...this.state.textList]

    const { selectedTextData } = this.state

    const element = {
      ...selectedTextData,
      ...data,
    }

    newList.splice(this.selectedTextIndex, 1, element)

    this.setState({ textList: newList, selectedTextData: element })

  }

  editSelectedTextStyleProperties = data => {
    if (this.selectedTextIndex === null) return;

    const newList = [...this.state.textList]

    const { selectedTextData } = this.state

    const element = {
      ...selectedTextData,
      style: {
        ...selectedTextData.style,
        ...data
      },
    }

    newList.splice(this.selectedTextIndex, 1, element)

    this.setState({ textList: newList, selectedTextData: element })

  }

  editText = (e) => {

    if (this.selectedTextIndex === null) return;

    const { name, value } = e.target
    const newList = [...this.state.textList]
    const text = this.state.textList[this.selectedTextIndex] || {}

    newList.splice(this.selectedTextIndex, 1)

    const element = {
      ...text,
      [name]: value
    }

    newList.splice(this.selectedTextIndex, 0, element);

    this.setState((s) => ({
      selectedTextData: {
        ...s.selectedTextData,
        [name]: value
      },
      textList: newList
    }))

  }

  editTextStyle = (e) => {

    if (this.selectedTextIndex === null) return;

    const { name, value } = e.target
    const newList = [...this.state.textList]
    const text = this.state.textList[this.selectedTextIndex] || {}

    newList.splice(this.selectedTextIndex, 1)

    const element = {
      ...text,
      style: {
        ...text.style,
        [name]: value
      }
    }

    newList.splice(this.selectedTextIndex, 0, element);

    this.setState({
      selectedTextData: element,
      textList: newList
    })

  }

  fontList = ["cursive", "emoji", "monospace", "sans-serif", "system-ui"]

  download = async () => {
    console.log(this.state.textList)
    const resp = await postTextContent({data:this.state.textList})
    console.log("resp", resp)
    return null
    const payload = createJson(this.vidRef.current, this.state.textList)
    try {
      const base_url = 'https://7a9d-111-118-241-68.ngrok-free.app'
      let { data } = await axios.post(base_url + '/api/evaluate-video', payload)
      console.log('Success :->', data)

    } catch (error) {
      console.log('errorrrr :->', error)
    }
    // createJson(this.vidRef.current , this.state.textList)
  }


  onVideoTimeChanged = () => {

    const currentTime = this.vidRef.current.currentTime?.toFixed(2)
    const textListToShow = [];

    const { textList } = this.state

    textList.forEach(Text => {
      const endTime = Text.to ?? this.vidRef.current.duration
      if (Text.from <= currentTime && endTime >= currentTime) {
        textListToShow.push(Text)
      }
    })

    this.setState({ showTextList: textListToShow, currentVideoPosition: currentTime });
  }

  setTransition = (e) => {
    const transitionType = e.target.value
    const transition = {
      type: transitionType,
      x: 0,
      y: 0,
      z: 0,
      from: [0, 0]
    }

    const { selectedTextData: { x, y, width, height } } = this.state
    switch (transitionType) {
      case TRANSITION_TYPES.SLIDE_RIGHT:
        transition.x = -1
        transition.y = 0
        transition.from = [-1 * (width || 200), y]
        break;
      case TRANSITION_TYPES.SLIDE_LEFT:
        transition.x = 1
        transition.y = 0
        transition.from = [this.vidRef.current.offsetWidth + (width || 200), y]
        break;
      case TRANSITION_TYPES.SLIDE_TOP:
        transition.y = 1
        transition.x = 0
        transition.from = [x, this.vidRef.current.offsetHeight + (height || 100)]

        break;
      case TRANSITION_TYPES.SLIDE_BOTTOM:
        transition.y = -1
        transition.x = 0
        transition.from = [x, -1 * (height || 100)]
        break;
      default:
        break;
    }

    this.editSelectedTextProperties({
      transition
    })
  }

  handleOnSlide = (obj, ind, dataId) => {

    if (ind !== this.selectedTextIndex) {
      this.changeSelectedTextIndex(ind)
    }

    setTimeout(()=>{
      this.editSelectedTextProperties(obj)
    },0)
  }

  render() {
    const { selectedTextData, textList, showTextList, isPlaying, currentVideoPosition } = this.state

    const video = this.vidRef.current

    const vidTotalDuration = video?.duration

    const transitionsList = [
      { url: "https://pixiko.com/static/images/effect_arrow_right.svg", type: TRANSITION_TYPES.SLIDE_RIGHT },
      { url: "https://pixiko.com/static/images/effect_arrow_left.svg", type: TRANSITION_TYPES.SLIDE_LEFT },
      { url: "https://pixiko.com/static/images/effect_arrow_bottom.svg", type: TRANSITION_TYPES.SLIDE_BOTTOM },
      { url: "https://pixiko.com/static/images/effect_arrow_top.svg", type: TRANSITION_TYPES.SLIDE_TOP },
      { url: "https://pixiko.com/static/images/motion/rotate-right.svg", type: TRANSITION_TYPES.ROTATE_RIGHT },
      { url: "https://pixiko.com/static/images/motion/rotate-left.svg", type: TRANSITION_TYPES.ROTATE_LEFT },
      { url: "https://pixiko.com/static/images/motion/fade-in.svg", type: TRANSITION_TYPES.FADE_IN },
      { url: "https://pixiko.com/static/images/motion/shake.svg", type: TRANSITION_TYPES.FADE_OUT },
      { url: "https://pixiko.com/static/images/motion/zoom-out.svg", type: TRANSITION_TYPES.ZOOM_OUT },
      { url: "https://pixiko.com/static/images/motion/zoom-in.svg", type: TRANSITION_TYPES.ZOOM_IN },
    ]

    const AdvanceTextStyles = [{
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      lineJoin: 'round'
    }, {
      dropShadow: true,
      dropShadowAlpha: 0.8,
      dropShadowAngle: 2.1,
      dropShadowBlur: 4,
      dropShadowColor: '0x111111',
      dropShadowDistance: 10,
      fill: ['#ffffff'],
      stroke: '#004620',
      fontWeight: 'lighter',
      lineJoin: 'round',
      strokeThickness: 12,
    },
    {
      fontWeight: '400',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#01d27e',
      strokeThickness: 5,
      letterSpacing: 20,
      dropShadow: true,
      dropShadowColor: '#ccced2',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
    }
    ]

    console.log('this', textList);
    return (
      <>
        <Box className='flex-se-c resp-flex max-screen-width'>
          <div style={{ textAlign: 'center' }}>
            <div id="video-container">
              <video
                id='vid-player'
                className='max-screen-width'
                // controls
                name={'initName'}
                onLoadedMetadataCapture={() => this.forceUpdate()}
                ref={this.vidRef}
                onTimeUpdate={this.onVideoTimeChanged}
                width={600}
                onEnded={() => this.setState({ isPlaying: false })}
                playsInline
                src={SunSetVid}
              />

              {isPlaying ? <Player height={video?.offsetHeight} width={video?.offsetWidth} currentVideoPosition={currentVideoPosition} textToRender={showTextList} />
                :
                <Stage
                  height={video?.offsetHeight}
                  width={video?.offsetWidth}
                  className='resp-size'
                  options={{ backgroundAlpha: 0 }}
                  onClick={(e) => {
                  }}
                >

                  {/* <Sprite
                    // ref={this.vidRef}
                    width={150}
                    height={150}
                    texture={Texture.from(RotatingTriangle)}
                    // updateTransform={0.1}
                    source={RotatingTriangle}
                  />
                   */}
                    {/* <Sprite 
                      image={SunSetVid}
                      // texture={Texture.from(SunSetVid)}
                      // video={Texture.from(SunSetVid)}
                      // source={Texture.from(SunSetVid)}
                      height={150} 
                      width={150} 
                    /> */}
                    <Container sortableChildren >
                    {textList?.map((Text, ind) => <EditableText ind={ind} editSelectedTextProperties={this.editSelectedTextProperties} changeSelectedTextIndex={() => this.changeSelectedTextIndex(ind)} {...Text} />)}
                    {/* <AnimatedText /> */}
                  </Container>
                </Stage>
              }

              {/* <DraggableText /> */}
              {/* < ImageTransformer /> */}
              {/* <div className='resp-size' >

                <div style={{ width: '100%', height: "calc(100% - 4px)", zIndex: 100 }}>
                  <Draggable bounds='parent' ><div style={{ height: '30px', width: '100px', display: 'inline-block', border: 'solid' }} onClick={() => { console.log('clicked') }} >check</div></Draggable>
                </div>
              </div> */}

              {/* <HtmlWrapper ind={this.selectedTextIndex} selectedElement={selectedTextData} listOfElements={textList} /> */}

            </div>
            <div >
              <Typography style={{ fontWeight: 'bold' }} >
                {currentVideoPosition}
              </Typography>

              <Slider
                onChange={(e) => { video.currentTime = e?.target?.value; this.onVideoTimeChanged() }}
                min={0}
                step={0.01}
                max={vidTotalDuration || undefined}
                value={currentVideoPosition}
                getAriaValueText={() => currentVideoPosition}
                valueLabelDisplay="on"
              />
            </div>
            <Button variant='contained' onClick={this.playPause} >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>

            <Button style={{ marginLeft: '6px' }} variant='contained' onClick={this.download} >
              Download
            </Button>

          </div>


          <section>
            
            {!!textList.length && <Box id='edit-container' >
              <Typography>
                Edit Text
              </Typography>
              <div>
                <p>Transitions</p>
                <div className="transition-btn-wrapper">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Transition</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      value={selectedTextData.transition?.type || null}
                      label="Select Transition"
                      onChange={this.setTransition}
                    >
                      <MenuItem value={null} className='transition-options' >
                        None
                      </MenuItem>
                      {
                        transitionsList.map(({ url, type }) => <MenuItem className='transition-options' key={type} value={type} data-type={type} >
                          <img src={url} alt={type} /> <Typography component='span' >{type}</Typography>
                        </MenuItem>
                        )
                      }
                    </Select>
                  </FormControl>

                </div>
              </div>
              <OutlinedInput
                multiline
                placeholder='Enter text to edit'
                name='text'
                value={selectedTextData.text || ""}
                // ref={this.inpRef}
                onChange={this.editText}
              />

              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="font-family">Font Family</InputLabel>
                <Select
                  labelId="font-family"
                  id=""
                  value={selectedTextData.style.fontFamily}
                  onChange={this.editTextStyle}
                  input={<OutlinedInput style={{ textAlign: "start" }} label="Font Family" />}
                  name="fontFamily"
                >
                  {this.fontList.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="text-decoration">Text Decoration</InputLabel>
                <Select
                  labelId="text-decoration"
                  id=""
                  value={selectedTextData.style.textDecoration}
                  onChange={this.editTextStyle}
                  input={<OutlinedInput style={{ textAlign: "start" }} label="Font Family" />}
                  name="textDecoration"
                >
                  <MenuItem value={'normal'} > Normal </MenuItem>
                  <MenuItem value={'underline'} > UnderLine </MenuItem>
                  <MenuItem value={'line-through'} > Line Through </MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="font-style">Font Style</InputLabel>
                <Select
                  labelId="font-style"
                  id=""
                  value={selectedTextData.style.fontStyle}
                  onChange={this.editTextStyle}
                  input={<OutlinedInput style={{ textAlign: "start" }} label="Font Style" />}
                  name="fontStyle"
                >
                  <MenuItem value={'normal'} > Normal </MenuItem>
                  <MenuItem value={'bold'} > Bold </MenuItem>
                  <MenuItem value={'italic'} > Italic </MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="text-align">Text Align</InputLabel>
                <Select
                  labelId="text-align"
                  id=""
                  value={selectedTextData.style.align}
                  onChange={this.editTextStyle}
                  input={<OutlinedInput style={{ textAlign: "start" }} label="Text Align" />}
                  name="align"
                >
                  <MenuItem value={'center'} > Center </MenuItem>
                  <MenuItem value={'left'} > Left </MenuItem>
                  <MenuItem value={'right'} > Right </MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="font-size">Font Size</InputLabel>
                <Input
                  type="number"
                  onChange={(e) => this.editTextStyle({ target: { name: 'fontSize', value: +e.target.value } })}
                  value={+selectedTextData.style.fontSize || 30}
                  // name="fontSize"
                  placeholder='Font Size'
                  id="font-size"
                  defaultValue={this.state.textList[this.selectedTextIndex]}
                />
              </FormControl>

              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="text-color">Text Color</InputLabel>
                <OutlinedInput style={{ textAlign: "start" }} label="Text Color" type="color" value={selectedTextData.style.fill} onChange={this.editTextStyle} name="fill" placeholder='Text Color' />
              </FormControl>

              <label >
                Opacity
                <Slider
                  name='opacity'
                  id='opacity'
                  getAriaValueText={() => selectedTextData.opacity || 0}
                  valueLabelDisplay="auto"
                  value={selectedTextData.style.opacity}
                  onChange={(e) => this.editTextStyle({ target: { name: 'opacity', value: +e.target.value } })}

                  // onChange={this.editTextStyle}
                  step={0.01}
                  min={0}
                  max={1}
                />
              </label>


              <FormControl fullWidth>
                <InputLabel id="text-varient">Text Varient</InputLabel>
                <Select
                  labelId="text-varient"
                  // value={selectedTextData.transition?.type}
                  label="Select Varient"
                  onChange={(e) => { const ind = e.target.value; const styles = AdvanceTextStyles[ind]; this.editSelectedTextStyleProperties(styles || {}) }}
                >
                  {/* <MenuItem >
                      None
                    </MenuItem> */}
                  {
                    AdvanceTextStyles.map((styleObj, ind) => (<MenuItem key={ind} value={ind} >
                      {/* <img src={url} alt={type} />  */}
                      <Typography >{ind + 1}</Typography>
                    </MenuItem>)
                    )
                  }
                </Select>
              </FormControl>

              <Button
                variant='contained'
                color='error'
                onClick={() => {
                  if (this.selectedTextIndex === null) return;
                  const newlist = [...this.state.textList]; newlist.splice(this.selectedTextIndex, 1);
                  this.selectedTextIndex = null;
                  this.setState({ textList: newlist, selectedTextData: {} })
                }}
              >
                Delete
              </Button>

            </Box>}

            <Button variant='contained' color='success' style={{ width: '100%', marginTop: '10px' }} onClick={this.addText} >
              Add Text
            </Button>

          </section>
        </Box>
        <Box sx={{ mt: 2 }} component='section' id='sliders-wrapper'>
          <Timer end={video?.duration || 0} >
            <div style={{ marginTop: '10px' }} >
              {textList.map(({ from, to, text, dataId }, ind) => <MinimumDistanceSlider key={dataId} dataId={dataId} ind={ind} text={text} start={from} end={to} max={vidTotalDuration} onSlide={this.handleOnSlide} />)}
            </div>
          </Timer>

        </Box>
      </>
    );
  }
}

function Timer({ end, children }) {
  const timerSections = [];
  // const currentTime = 0
  function getTime(seconds) {
    if (seconds > 59) {
      const mins = Math.floor(seconds / 60) + '';
      const Seconds = seconds % 60 + '';
      return mins > 59 ? '00:' : '' + mins.padStart(2, '0') + ':' + Seconds.padStart(2, '0')
    }
    return '00:' + seconds.toString().padStart(2, '0')
  }
  for (let i = 0; i <= Math.ceil(end); i++) {
    const currTime = getTime(i)
    timerSections.push(<div className='timer-section' title={currTime} > {!!i && <span className='vertical-section' />} {currTime} </div>)

  }
  return <section id='show-timer' >
    <div id='main-timer'>
      <div style={{ display: 'flex' }} >
        {timerSections}
      </div>

      {children}
    </div>
  </section>
}

function MinimumDistanceSlider({ start = 0, end, max = 0, slidable = true, onSlide, text = 'NA', dataId, ind }) {
  const Max = Math.ceil(max);

  const value1 = [start, end || Max]

  const handleSlide = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue) || end === 0) {
      return;
    }

    if (activeThumb === 0) {
      const from = Math.min(newValue[0], value1[1] - 1)

      onSlide({ from, to: end }, ind, dataId)

    } else {
      const to = Math.max(newValue[1], value1[0] + 1)

      onSlide({ from: start, to }, ind, dataId)
    }
  };

  return (
    <Slider
      value={value1}
      onChange={handleSlide}
      valueLabelDisplay="auto"
      getAriaValueText={() => value1}
      disableSwap
      max={Max}
      min={0}
      step={0.01}
    />
  );
}

// Trialll

// import { Stage, Text } from '@inlet/react-pixi';

const AnimatedText = () => {
  const [position, setPosition] = useState(0);
  const ref = useRef(0)

  useEffect(() => {
    let animationId = requestAnimationFrame(animate);

    function animate() {

      setPosition((prevPosition) => {
        if (prevPosition < 300) { return prevPosition + 3 }

        else {
          cancelAnimationFrame(animationId);
        }
        return 300
      });
      animationId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationId);

  }, []);
  return (
    <Text
      ref={ref}
      text="Your Text Here"
      x={position}
      y={200}
      style={{
        fill: 'white',
        fontFamily: 'Arial',
        fontSize: 32,
      }}
    />
  );
};

//// 

function HtmlWrapper({ listOfElements, selectedElement, ind }) {
  return <div className='resp-size'  >
    <div style={{ width: '100%', height: "calc(100% - 4px)", zIndex: 100 }} >
      {listOfElements.map(Element => {
        const { width, height, data_id, x, y } = Element
        const style = { width, height, data_id, display: 'inline-block', border: "solid", left: x, top: y, position: 'absolute' }
        console.log(style)
        return <SelectedDesign style={style} />
      })}
    </div>
  </div>
}

function WorkingHtmlWrapper({ listOfElements, selectedElement, ind }) {
  return <div className='resp-size' >

    <div style={{ width: '100%', height: "calc(100% - 4px)", zIndex: 100, }}>
      {listOfElements.map(Ele => <SelectedDesign />)}
    </div>
  </div>
}

function SelectedDesign({ style }) {
  return <Draggable bounds="parent">
    <div style={style} >

    </div>
  </Draggable>
}

function ImageTransformer({ style }) {
  // const isResizing = useRef()
  const isResizing = useRef(false);
  const isDragging = useRef(false);
  const ref = useRef()
  const prev = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // console.count('useEffect')
    const transformBox = document.querySelector('.transform-box');
    const handles = document.querySelectorAll('.handle');

    let prevX = 0;
    let prevY = 0;

    // handles.forEach((handle) => {
    //   handle.addEventListener('mousedown', (event) => {
    //     event.stopPropagation();
    //     isResizing.current = true;
    //     prevX = event.clientX;
    //     prevY = event.clientY;
    //     console.log(prevX, prevY)
    //   });
    // });

    // transformBox.addEventListener('mousedown', );
    const wrapper = document.getElementById('video-container')
    if (!wrapper.onMouseMove) {
      console.log('inside');
      wrapper.onmousemove = (event) => {
        // console.log('event', isDragging.current);
        if (isDragging.current) {
          // console.log('if');
          const newX = prev.current.x - event.clientX;
          const newY = prev.current.y - event.clientY;
          const rect = ref.current.getBoundingClientRect();
          console.log('element', ref.current, rect);
          console.log('event dragging', event.clientX, event.clientY, rect.left, rect.top, newX, newY, `${rect.left - newX}px`);

          // ref.current.style.left = `${rect.left - newX}px`;
          // ref.current.style.top = `${rect.top - newY}px`;

          // prev.current.x = event.clientX;
          // prev.current.y = event.clientY;
        }
      }
    }
  }, [])

  // document.addEventListener('mousemove', (event) => {
  //   // if (isResizing.current) {

  //   //   const rect = ref.current.getBoundingClientRect();
  //   //   const width = rect.width + (event.clientX - prevX) -4;
  //   //   const height = rect.height + (event.clientY - prevY) -4;
  //   //   ref.current.style.width = `${width}px`;
  //   //   ref.current.style.height = `${height}px`;

  //   //   prevX = event.clientX;
  //   //   prevY = event.clientY;
  //   // } else 
  //   if (isDragging.current) {
  //     const newX = prev.current.x - event.clientX +8 ;
  //     const newY = prev.current.y - event.clientY +8;
  //     const rect = ref.current.getBoundingClientRect();

  //     console.log('event dragging', event.clientX, event.clientY, rect.left,  rect.top, newX, newY);

  //     ref.current.style.left = `${rect.left - newX}px`;
  //     ref.current.style.top = `${rect.top - newY}px`;

  //     prev.current.x = event.clientX;
  //     prev.current.y = event.clientY;
  //   }
  // });

  const onMouseDown = (event) => {
    console.log('mousedown');
    // event.preventDefault();
    isDragging.current = true;
    prev.current.x = event.clientX;
    prev.current.y = event.clientY;
    console.log(prev.current.x, prev.current.y);
  }

  const onMouseUp = () => {
    console.log('mouseUp');
    isResizing.current = false;
    isDragging.current = false;
  }

  return (
    <div style={style} onMouseDown={onMouseDown} onMouseUp={onMouseUp} ref={ref} >

    </div>
  );
}