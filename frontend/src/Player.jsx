import React, { memo, useRef, useState } from 'react'

import AnimatableText from './CommonComponents/AnimatableText'
import { Container, Stage } from '@pixi/react'

function Player({ height, width, textToRender, currentVideoPosition }) {

  const TextList = textToRender.map(
    Text => <AnimatableText
      key={Text.dataId}
      {...Text}
      currentVideoPosition={currentVideoPosition}
      screenWidth={width}
      screenHeight={height}
    />)


  return (
    <>

      <Stage
      id='my-Canvas'
        className='resp-size'
        options={{ backgroundAlpha: 0 }}
        height={height}
        width={width}
      >

        <Container sortableChildren >

          {TextList}
        </Container>

      </Stage>

      <div style={{ zIndex: 5 }} className='resp-size' />

    </>)
}


export default memo(Player)