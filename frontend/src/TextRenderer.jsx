import { Container, Text } from '@pixi/react'
import { TextStyle } from 'pixi.js'
import React, { useEffect, useState } from 'react'
import AnimatableText from './CommonComponents/AnimatableText'

export default function TextRenderer({ updChildFuncRef, giveFunc, vid }) {
    const [list, setList] = useState([])
    const width = vid.current.width
    const currentVideoPosition = vid.current.currentTime
    const height = vid.current.height
    useEffect(()=>{
        updChildFuncRef.current = updateList
    }, [])
    const TextList = list?.map(
        ({style, ...text}) => <AnimatableText
          key={Text.dataId}
          {...text}
          style={new TextStyle(style)}
          currentVideoPosition={currentVideoPosition}
          screenWidth={width}
          screenHeight={height}
        />)

    function updateList(txtList) {
        setList(txtList)
    }
    // console.log()
    console.log(height,width, currentVideoPosition)
    return (
        <Container sortableChildren>
            {TextList}
        </Container>
    )
}
