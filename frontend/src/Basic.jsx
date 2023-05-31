import React, { Component, PureComponent, createRef } from 'react';
import { Stage, Layer } from 'react-konva';
// import Konva from 'konva';
import OneMinVid from './assets/1_Minute_Timer.mp4'
import './basic.css'

import { CustomizableText } from './CommonComponents/CustomizableText';
import { createJson } from './BasicHelpers';
import axios from 'axios';
import MyText from './CommonComponents/MyText';


export default class Konvaa extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      textList: [],
      selectedTextData: {},
      isTransforming: false
    }
  }

  vidRef = createRef(null)
  vidHandlerBtn = createRef(null)

  playPause = () => {
    if (this.vidRef.current.paused) {
      this.vidHandlerBtn.current.innerText = 'Pause'
      this.vidRef.current.play();
    }
    else {
      this.vidHandlerBtn.current.innerText = 'Play'
      this.vidRef.current.pause();
    }
  }

  componentDidMount() {
    this.textRef.current = {}
  }

  initTextData = {
    x: 0,
    y: 0,
    // text: "Text",
    background: '#0000',
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: '#000',
    // width: undefined,
    // height: undefined,
    // padding: 0,
    fontStyle: 'normal',
    align: 'center',
    draggable: true,
    dataId: 0,
    textDecoration: 'normal',
    selected: false,
    isEditing: false,
    opacity: 1,
    // onTextChange: (text) => this.handleChange({ text }),
    // onTextResize: (width, height) => {
    //   this.handleChange({ width, height })
    // },
    // onClick: this.changeSelected ,
    // onTextClick : (newSelected) => {
    //   this.handleChange({ selected: newSelected })
    // },
    // getSelectedText: this.getSelectedText,
    // onDragEnd: this.onDragEnd,
    // onClick:this.getSelectedText,
  }

  generateNewTextProps = ()=> ({
    ...this.initTextData,
    text: `Text${this.dataId}` ,
    dataId: this.dataId++,
  })

  dataId = 0

  selectedTextIndex = null

  getSelectedText = (e) => {
    for (let i = 0; i < this.state.textList.length; i++) {
      const textElement = this.state.textList[i]
      if ( textElement.dataId === e.target.attrs.dataId ) {
        this.selectedTextIndex = i;
        this.getSelectedTextProperties(i)
        return i
      }
    }
    this.selectedTextIndex = null;
  }

  getSelectedTextProperties = (i) => this.setState((s) => ({ selectedTextData: s.textList[i] }))

  addText = () => {
    const newTextProps = this.generateNewTextProps()

    this.selectedTextIndex = this.state.textList.length;
    const newList = [...this.state.textList, newTextProps]

    // setTimeout(() => {
    //   this.getSelectedTextProperties(newList.length - 1)
    // }, 0)
    
    this.setState({ textList: newList }, ()=> this.getSelectedTextProperties(newList.length - 1) )
  }

  onDragEnd = (e) => {

    const i = this.getSelectedText(e);

    const x = e.target.attrs.x
    const y = e.target.attrs.y

    this.selectedTextIndex = i;

    const textElement = this.state.textList[i]
    const element = {
      ...textElement,
      x,
      y,
    }

    const newList = [...this.state.textList]
    newList.splice(this.selectedTextIndex, 1, element)

    this.setState({ textList: newList })

    // for (let i = 0; i < this.state.textList.length; i++) {
    //   const textElement = this.state.textList[i]
    //   if ( textElement.dataId === e.target.attrs.dataId ) {
    //     const x = e.target.attrs.x
    //     const y = e.target.attrs.y
    //     this.selectedTextIndex = i;

    //     const newList = [...this.state.textList]

    //     this.getSelectedTextProperties(i)

    //     const element = {
    //       ...textElement,
    //       x,
    //       y,
    //     }

    //     newList.splice(this.selectedTextIndex, 1, element)

    //     // newList.splice(this.selectedTextIndex, 0, element);
    //     this.setState({ textList: newList })

    //     break;
    //   }
    // }

    // const newList = [ ...this.state.textList ]
    // const text = this.state.textList[this.selectedTextIndex] || {}
  }

  handleChange = data => {
    const newList = [...this.state.textList]
    const text = this.state.textList[this.selectedTextIndex] || {}

    const element = {
      ...text,
      ...data,
      // ...this.textRef.current,
    }

    newList.splice(this.selectedTextIndex, 1, element)

    this.setState({ textList: newList, selectedTextData: element })

  }

  changeSelected = () => {
    const newList = [...this.state.textList]
    const text = this.state.textList[this.selectedTextIndex] || {}

    const element = {
      ...text,
      selected: !text.selected
    }
    
    newList.splice(this.selectedTextIndex, 1, element)

    this.setState({ textList: newList })
  }

  toogleIsEditing = ()=>{

    const newList = [...this.state.textList]
    const text = this.state.textList[this.selectedTextIndex] || {}

    const element = {
      ...text,
      isEditing: !text.isEditing
    }
    
    newList.splice(this.selectedTextIndex, 1, element)

    this.setState({ textList: newList })

  }

  editText = (e) => {
    // this.changeText(e)
    // if (this.selectedText === null) return;
    const { name, value } = e.target
    const newList = [...this.state.textList]
    const text = this.state.textList[this.selectedTextIndex] || {}

    newList.splice(this.selectedTextIndex, 1)

    const element ={
      ...text,
      [name]: value
    }
    
    newList.splice(this.selectedTextIndex, 0, element);
    // this.setState({ textList: newList })
    
    this.setState((s) => ({ 
      selectedTextData: { 
        ...s.selectedTextData, 
        [name]: value 
      }, 
      textList: newList 
    } ))

  }


  fontList = ["cursive", "emoji", "monospace", "sans-serif", "system-ui"]

  textRef = createRef(null)
  inpRef = createRef(null)

  layerRef = createRef(null)

  changeText = ({ target: { value, name } }) => {
    // this.textRef.current = { ...this.textRef.current, [name]: value };
    this.setState((s) => ({ selectedTextData: { ...s.selectedTextData, [name]: value } }))
  }

  download = async ()=>{
    const payload = createJson(this.vidRef.current, this.state.textList)
    console.log('body', payload)
    try {
      // let resp = await fetch('https://0dea-111-118-241-68.ngrok-free.app/api/evaluate-video', {
      //   method: "POST",
      //   body: JSON.stringify(payload)
      // })
      // resp = await resp.json()
      // console.log(resp.data)
      let {data} = await axios.post('https://0dea-111-118-241-68.ngrok-free.app/api/evaluate-video', payload)
      console.log('data = ', data)

    } catch (error) {
      console.log('errorrrr :->', error)
    }
    createJson(this.vidRef.current , this.state.textList)
  }

  render() {
    const { selectedTextData, textList } = this.state

    const TextList = textList.map( 
      Text => <MyText 
        key={Text.dataId}
        {...Text} 
        onTextChange={(e) => this.handleChange({ text: e.target.value })}
        onTextResize={(width, height) => {
          this.handleChange({ width, height })
        }}
        toggleTransforming = {()=>{
          this.setState( (s)=> ({isTransforming: !s.isTransforming }))
        }}
        isTransforming={this.state.isTransforming}
        // isEditing={this.state.selectedTextData.isEditing}
        onClick={() => {
          this.changeSelected()
        }}
        toogleIsEditing={this.toogleIsEditing}
        onTextClick={(newSelected) => {
          this.handleChange({ selected: newSelected })
        }}
        getSelectedText={this.getSelectedText}
        onDragEnd={this.onDragEnd}
      />)

      console.log('rendered and text = ',selectedTextData.text)

    return (
      <div className='flex-se-c resp-flex max-screen-width'>
        <div style={{textAlign:'center'}}>
          <div id="video-container">
            <video
              id='vid-player'
              className='max-screen-width'
              name={'initName'}
              ref={this.vidRef}
              width={600}
              playsInline
              src={OneMinVid}
            />
            <Stage 
              height={this.vidRef.current?.offsetHeight} 
              width={this.vidRef.current?.offsetWidth} 
              className='resp-size' 
              onClick={(e) => {
                if (e.currentTarget._id === e.target._id) {
                  this.handleChange({selected: false, isEditing: false })

                }
              }} 
            >
              <Layer ref={this.layerRef}>

                {TextList}
                
              </Layer>
            </Stage>
          </div>

          <button ref={this.vidHandlerBtn} onClick={this.playPause} >
            Play
          </button>
          <button onClick={()=>{createJson( this.vidRef.current , textList )}} >
            Download
          </button>
          
        </div>


        <section>

          <div id='edit-container' >
            Edit Text
            <textarea
              type="text"
              placeholder='Enter text to edit'
              name='text'
              value={selectedTextData.text || ""}
              ref={this.inpRef}
              onChange={this.editText}
            />

            <select value={selectedTextData.fontFamily} onChange={this.editText} name="fontFamily" id="font-family">
              <option disabled value="">Font Family</option>

              {this.fontList.map((font, ind) => <option key={ind} value={font}>{font}</option>)}
            </select>

            <label >
              Text Decoration
              <select value={selectedTextData.textDecoration} onChange={this.editText} name="textDecoration" id="text-decoration">
                <option disabled value=""> Text Decoration </option>
                <option value='underline' > UnderLine </option>
                <option value='normal' > normal </option>
                <option value='line-through' > LineThrough </option>
              </select>
            </label>

            <label >
              Font Style
              <select value={selectedTextData.fontStyle} onChange={this.editText} name="fontStyle" id="font-style">
                <option disabled value=""> Font Style </option>
                <option value='normal' > Normal </option>
                <option value='bold' > Bold </option>
                <option value='italic' > italic </option>
              </select>
            </label>

            <label >
              Text Align
              <select value={selectedTextData.align} onChange={this.editText} name="align" id="text-align">
                <option disabled value=""> Text Align </option>
                <option value='center' > Center </option>
                <option value='left' > Left </option>
                <option value='right' > Right </option>
              </select>
            </label>

            <input
              type="number"
              onChange={this.editText}
              value={+selectedTextData.fontSize || 30}
              name="fontSize"
              placeholder='Font Size'
              id="font-size"
              defaultValue={this.state.textList[this.selectedTextIndex]}
            />

            <label >
              Text Color
              <input type="color" value={selectedTextData.fill} onChange={this.editText} name="fill" placeholder='Text Color' />
            </label>

            <label >
              Background Color
              <input type="color" value={selectedTextData.background} onChange={this.editText} name="background" />
            </label>

            <label >
              Opacity
              <input name='opacity' value={selectedTextData.opacity*100} onChange={(e)=>{ const value= e.target.value/100;   this.editText({target:{ name:'opacity', value }})}} type="range" min={0} max={100} />
            </label>


            <button onClick={() => { const newlist = [...this.state.textList]; newlist.splice(this.selectedTextIndex, 1); this.setState({ textList: newlist }) }} >
              Delete
            </button>

          </div>

          <button style={{width:'100%', marginTop: '10px'}} onClick={this.addText} >
            Add Text
          </button>

        </section>
      </div>
    );
  }
}