import React, { useEffect, useRef, useState } from 'react'
import { TextStyle } from 'pixi.js';
import { Text } from '@pixi/react';

function AnimatableText({ x=0, y=0, transition, currentVideoPosition, screenWidth, screenHeight, from, opacity, style, ...remainingProps }) {
  const textRef = useRef()

  const [position, setPosition] = useState([x,y])

  const timeDifferenceIsLessThanOne = (currentVideoPosition - from) < 1;

  const initTextPosition = ()=>{
    if(transition?.x === 1){
      return [ screenWidth + textRef.current.width, y ]
    }
    else if(transition?.x === -1){
      return [ -textRef.current.width, y ]
    }
    else if(transition?.y === 1){
      return [ x, screenHeight + textRef.current.height ]
    }
    else if(transition?.y === -1){
      return [ x, -textRef.current.height ]
    }
    return [x, y]
  }

  useEffect(() => {

    setPosition( initTextPosition() )

    let animationId 
    
    if (transition?.type && timeDifferenceIsLessThanOne  ) 
      animationId = requestAnimationFrame(animate);

    function animate() {

      setPosition((prevPosition) => {
        const [prevX, prevY] = prevPosition
        if (transition.x === 1 && prevX > x ) {
          return [prevX - 3, y]
        }
        else if (transition.x === -1 && prevX < x ) {
          return [prevX + 3, y]
        }
        else if (transition.y === 1 && prevY > y) {
          return [x, prevY - 3]
        }
        else if (transition.y === -1 && prevY < y) {
          return [x, prevY + 3]
        }
        else {
          cancelAnimationFrame(animationId);
          return [x, y]
        }

      });

      animationId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationId);    

  }, []);
  
  return (
    <Text
      ref={textRef}
      alpha={opacity}
      x={position[0]}
      y={position[1]}
      style={new TextStyle({...style, fontSize: 40})}
      {...remainingProps}
    />
  )
}

export default AnimatableText
// export default memo(AnimatableText, (prevProps, nextProps)=> true )

