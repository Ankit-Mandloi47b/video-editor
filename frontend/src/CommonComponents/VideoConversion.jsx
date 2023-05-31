import { Sprite, Stage, Text } from '@pixi/react'
import { TextStyle } from 'pixi.js'
import React from 'react'
import { useEffect, useRef } from 'react'
import { downloadContentFromUrl } from '../helper_functions/download_content'
import { recordVideo } from '../helper_functions/record_canvas_video'

export default function VideoConversion({ json = [], duration=5000, onVideoComplete, height, width }) {
    useEffect(()=>{
        (async ()=>{
            const canvas = canvasRef.current;
            const url = await recordVideo(canvas, duration)
            downloadContentFromUrl(url)
        })();
    })

    const canvasRef = useRef()
    
    return (
        <div style={{opacity: 0, position: 'fixed', zIndex: -100}} >
        <Stage ref={canvasRef} options={{backgroundAlpha: 0}} height={height} width={width} >
            {json.map(Element => <GetElement {...Element} />)}
        </Stage>
        </div>
    )
}

function GetElement({ type, ...props }) {
    switch (type) {
        case 'image':
            return <Sprite {...props} />
        case 'text':
            const { style, ...remainingProps } = props
            return <Text {...remainingProps} style={new TextStyle(style)} />
        default:
            return null
    }
}