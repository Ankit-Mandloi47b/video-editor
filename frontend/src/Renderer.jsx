import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
// import textJson from './exampleApiPayload/textJson.json'
import { AnimatedSprite, Container, Sprite, Stage, Text } from '@pixi/react';
import { Texture, VideoBaseTexture, BaseTexture, TextStyle } from 'pixi.js';

// // Video
import SunSetVid from './assets/sunset1920.mp4'
import AnimatableText from './CommonComponents/AnimatableText';
import TextRenderer from './TextRenderer';
// import axios from 'axios';
import { recordVideo } from './helper_functions/record_canvas_video';
import { downloadContentFromUrl } from './helper_functions/download_content';
import { getTextContent } from './services/apis';


// export default function Renderer() {
//     // const location = useLocation()
//     const { id } = useParams();
//     const [ data ] = useState(textJson)
//     const [url, setUrl] = useState(null)
//     // const check = new VideoResource
//     const vidRef = useRef()
//     useEffect(() => {
//         console.log(id);
//         console.log(vidRef.current)
//         // console.log(URL.createObjectURL(SunSetVid))
//         setUrl(1)
//     }, [])



//     if (id==='null' || id==='undefined' || id==='none') 
//         return <h3>401 cannot get id</h3>
//     return url ? (
//     <Stage>
//         <Sprite  
//             ref={vidRef}
//             // source={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} 

//             texture={Texture.from('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
//         />
//         {/* <VideoResource /> */}
//         <Container>
//         </Container>
//     </Stage>
//   ):
//   'Loading...'
// }


// import React, { useEffect, useRef } from 'react';
// import { Stage, Sprite } from '@pixi/react';
// import { Texture, BaseTexture } from 'pixi.js';

const VideoPlayer = () => {

    const videoRef = useRef();
    const spriteRef = useRef();
    const updateChildFunc = useRef()
    const [show, setShow] = useState(false)
    const { id } = useParams()
    const textJson = useRef()
    console.log("id id idid", id);
    // useEffect(() => {
    //    if(show){
    //     const video = videoRef.current;
    //     const baseTexture = new BaseTexture(video);
    //     // console.log(baseTexture)

    //     const texture = new Texture(baseTexture);
        
    //     spriteRef.current.texture = texture;
    //    }
    // }, [show]);

    async function Play() {
        // setShow(true)
        const {data} = await getTextContent(id)
        textJson.current = data
        console.log("data",data)
        const video = videoRef.current;
        const baseTexture = new BaseTexture(video);
        // console.log(baseTexture)

        const texture = new Texture(baseTexture);
        
        spriteRef.current.texture = texture;

        const canvas = document.getElementById('canvas-id')
        console.log(canvas)
        // alert(video.duration)
        const url = await recordVideo(canvas, video.duration* 1000)
        try {
            downloadContentFromUrl(url)
        } catch (error) {
          console.log('errlrr', error)
        }
    }

    const onVideoTimeChanged = () => {
        const video = videoRef.current;
        // const video = videoRef.current;
        // const baseTexture = new BaseTexture(video);
        // console.log(baseTexture)

        // const texture = new Texture(baseTexture);
        // console.log(texture)
        // // spriteRef.current.height= video.height
        // // spriteRef.current.width= video.width
        // spriteRef.current.texture = texture;
        const currentTime = video.currentTime?.toFixed(2)
        // console.count('vid time updated')
        const textListToShow = []
        textJson?.current?.forEach(Text => {
            const endTime = Text.to ?? video.duration
            if (Text.from <= currentTime && endTime >= currentTime) {
                textListToShow.push(Text)
            }
        })
        // setShow(textListToShow)
        updateChildFunc.current(textListToShow)
    }

    const video = videoRef.current;

    // const getFunc = (func)=> {
    //     updateChildFunc = func
    // }

    // const TextList = show?.map(
    //     ({style, ...text}) => <Text
    //       key={Text.dataId}
    //       {...text}
    //       style={new TextStyle(style)}
    //       currentVideoPosition={currentVideoPosition}
    //       screenWidth={width}
    //       screenHeight={height}
    //     />)
        // console.log(TextList)
        const width = video?.width
        const height = video?.height
    return (
        <>
            <video
                ref={videoRef}
                style={{opacity:0, position: "fixed", zIndex: -10}}
                src={SunSetVid}
                onLoadedMetadata={(e)=>{videoRef.current= e.target}}
                onTimeUpdate={onVideoTimeChanged}
            />
            <Stage id='canvas-id' options={{backgroundAlpha: 0.2}} height={1080} width={1920} >
                {/* <Sprite ref={spriteRef} texture={Texture.WHITE} x={0} y={0} width={video?.width} height={video?.height} /> */}
                <AnimatedSprite ref={spriteRef} textures={[Texture.WHITE]} x={0} y={0} width={width} height={height} ></AnimatedSprite>
                <TextRenderer 
                    // giveFunc={getFunc} 
                    updChildFuncRef={updateChildFunc} 
                    vid={videoRef}
                />
            </Stage>
            <button id='click' onClick={Play} >click</button>
        </>
    ) || "loading...";
};

export default VideoPlayer;

