// import { Text } from 'react-pixi-fiber';
import { Text } from '@pixi/react';
import { TextStyle } from 'pixi.js';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'

const testObj = {
  abcd: 'AbCdEfG',
  hook: ()=>alert('working')
};


export const DraggableText0 = () => {
  const textRef = useRef(null);
  const [isDragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragStart = (event) => {
    if(!event.target) return  
    setDragging(true);
    event.target.alpha = 0.7;
    event.target.zIndex = 1
    event.target.dragData = event.data;
  };

  const handleDragEnd = (event) => {
    setDragging(false);
    if(!event.target) return
    event.target.alpha = 1;
    event.target.zIndex = undefined
    event.target.dragData = null;
  };

  const handleDragMove = (event) => {
    if (isDragging) {
      const newPosition = event.target?.dragData?.getLocalPosition(event.target.parent);
      setPosition({ x: newPosition.x, y: newPosition.y });
    }
  };

  return (
      <Text
        ref={textRef}
        text="Trial Text"
        x={position.x}
        y={position.y}
        interactive={true}
        buttonMode={true}
        onpointerdown={handleDragStart}
        onpointerup={handleDragEnd}
        onpointerupoutside={handleDragEnd}
        onpointermove={handleDragMove}
        
      />
  );
};

export const DraggableText1 = () => {
  const Drag = useDrag( 0, 0 );
  const { ref } = Drag
  return (
      <Text
        // ref={textRef}
        text="Drag me!!!"
        {...Drag}
        // x={position.x}
        // y={position.y}
        // // anchor={0.5}
        // interactive={true}
        // buttonMode={true}
        // onpointerdown={handleDragStart}
        // onpointerup={handleDragEnd}
        // onpointerupoutside={handleDragEnd}
        // onpointermove={handleDragMove}
      />
  );
};

const DraggableText = ({ editText, ind, changeSelectedTextIndex, editSelectedTextProperties, opacity, x, y, style, ...props }) => {
  
  const {ref, position, pointerup, alpha, ...Drag} = useDrag(x, y)

  useEffect( () => {
    const { width, height } = ref.current
    // editSelectedTextProperties({ width, height })
  }, [style.fontSize, ] );

  const onDragEnd = () => {
    pointerup()
    const {x, y} = ref.current
    editSelectedTextProperties({x, y})
  }

  return (
    <Text
      {...props}
      ref={ref}
      x={position.x}
      y={position.y}
      style={new TextStyle(style)}
      onclick={changeSelectedTextIndex}
      {...Drag}
      pointerup={onDragEnd}
      alpha={alpha === 1 ? opacity : alpha}

    />
  );
};

export const EditableText = memo(DraggableText)

const useDrag = ( x, y ) => {
  const ref = useRef(null);
  const isDragging = React.useRef(false);
  const offset = React.useRef({ x: x, y: y });
  const [position, setPosition] = React.useState({ x: x, y: y })
  const [alpha, setAlpha] = React.useState(1);

  const onDown = e => {
    isDragging.current = true;    
    offset.current = {
      x: e.data.global.x - position.x,
      y: e.data.global.y - position.y
    };
    
    setAlpha(0.5);
  }

  const onUp = () => {
    isDragging.current = false;
    setAlpha(1);
    setPosition({
      x: ref.current.x,
      y: ref.current.y,
    })
  }
  const onMove = e => {
    if (isDragging.current) {
      ref.current.x = e.data.global.x - offset.current.x
      ref.current.y = e.data.global.y - offset.current.y
    }
  };

  return {
    ref,
    interactive: true,
    pointerdown: onDown,
    pointerup: onUp,
    pointerupoutside: onUp,
    pointermove: onMove,
    alpha,
    position,
  };
};

export default testObj;

////////////////////
// // Old useDrag Hook
// const useDrag = ({ x, y }) => {
//   const sprite = useRef();
//   const [isDragging, setIsDragging] = useState(false);
//   const [position, setPosition] = useState({ x, y });
//   const onDown = useCallback(() => setIsDragging(true), []);
//   const onUp = useCallback((x,y) => {testObj.hook(x,y); setIsDragging(false)}, []);
//   const onMove = useCallback(e => {
//     if (isDragging && sprite.current) {
//       console.log( e.data, e)
//       setPosition(e.data.getLocalPosition(sprite.current.parent));
//     }
//   }, [isDragging, setPosition]);
//   return {
//     ref: sprite,
//     interactive: true,
//     pointerdown: onDown,
//     pointerup: ()=>onUp(position.x, position.y),
//     pointerupoutside: ()=>onUp(position.x, position.y),
//     pointermove: onMove,
//     alpha: isDragging ? 0.5 : 1,
//     position,
//   };
// };

/////////////////////////
// // Old DraggableText
// export const DraggableText = ({ text, editText, tint, ind, changeSelectedTextIndex, x, y, style: {opacity, ...style}, ...props }) => {
//   const textRef = useRef(null);
//   console.log(x,y);
//   const isDragging = React.useRef(false);
//   const offset = React.useRef({ x: x, y: y });
//   const [position, setPosition] = React.useState({ x: x, y: y })
//   const [alpha, setAlpha] = React.useState(1);
//   const [zIndex, setZIndex] = React.useState(1);
  
//   function onStart(e) {
//     console.log(textRef.current);
//     isDragging.current = true;    
//     offset.current = {
//       x: e.data.global.x - position.x,
//       y: e.data.global.y - position.y
//     };
    
//     setAlpha(0.5);
//     setZIndex((index)=>index+1);
//   }

//   function onEnd() {
//     isDragging.current = false;
//     setAlpha(1);
//     setPosition({
//       x: textRef.current.x,
//       y: textRef.current.y,
//     })
//   }

//   function onMove(e) {
//     if (isDragging.current) {
//       textRef.current.x = e.data.global.x - offset.current.x
//       textRef.current.y = e.data.global.y - offset.current.y
//       // setPosition({
//       //   x: e.data.global.x - offset.current.x,
//       //   y: e.data.global.y - offset.current.y,
//       // })
//     }
//   }

//   return (
//     <Text
//       text={text}
//       ref={textRef}
//       x={position.x}
//       y={position.y}
//       zIndex={zIndex}
//       alpha={alpha === 1 ? opacity : alpha}
//       style={new TextStyle({...style })}
//       interactive={true}
//       buttonMode={true}
//       onmousedown={onStart}
//       onclick={()=>changeSelectedTextIndex(ind)}
//       onmouseup={onEnd}
//       onmouseupoutside={onEnd}
//       onmousemove={onMove}
//       onpointerdown={onStart}
//       onpointerup={onEnd}
//       onpointerupoutside={onEnd}
//       onpointermove={onMove}

//     />
//   );
// };