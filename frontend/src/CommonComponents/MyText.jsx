import React, { useEffect, useRef } from 'react'
import { Rect, Text, Transformer } from 'react-konva'
import { Html } from 'react-konva-utils'

export default function MyText({
  text,
  isTransforming,
  isEditing,
  toggleTransforming,
  selected,
  onClick: OnClick,
  background,
  toogleIsEditing,
  onTextChange,
  ...rest
}) {
  const textRef = useRef()
  const transformerRef = useRef()

  useEffect(()=>{
    if(transformerRef.current && textRef.current ){
      transformerRef.current.nodes([textRef.current])
    }
  },[selected])


  const MIN_WIDTH = 30
  // const MIN_HEIGHT = 20

  const handleResize = ()=>{
    const text = textRef.current 
    text?.setAttrs({
      width: Math.max(text.width() * text.scaleX(), MIN_WIDTH),
      // height: Math.max(text.height() * text.scaleY(), MIN_HEIGHT),
      scaleX: 1,
      scaleY: 1,
    });
  }

  useEffect( ()=>{
    handleResize()
  }, [rest.fontSize, text, rest.fontFamily, rest.fontStyle] )

  function toggleEdit() {
    toogleIsEditing()
    OnClick()
  }

  function handleEscapeKeys(e) {
    const RETURN_KEY = 13;
    const ESCAPE_KEY = 27;
    if ((e.keyCode === RETURN_KEY && !e.shiftKey) || e.keyCode === ESCAPE_KEY) {
      toggleEdit(e);
    }
  }

  const transformer = selected && ! isEditing ? (
    <Transformer
      ref={transformerRef}
      rotateEnabled={false}
      flipEnabled={false}
      // enabledAnchors={["middle-left", "middle-right", 'top-left', 'top-right', 'bottom-left', 'bottom-right',  'bottom-center', 'top-center']}
      enabledAnchors={["middle-left", "middle-right"]}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < MIN_WIDTH) {
          return oldBox;
        }
        return newBox;
      }}
    />
  ) : null;

  const HEIGHT = textRef.current?.height() || 0
  const WIDTH = textRef.current?.width() || 0

  function getStyle(width, height, fontSize, check) {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    const baseStyle = {
      width: `${width}px`,
      height: `${height}px`,
      border: "none",
      padding: "0px",
      margin: "0px",
      background: "none",
      outline: "none",
      resize: "none",
      // borderBottom: 'solid 1px',
      color: check.fill || "black",
      fontFamily: "sans-serif",
      ...check,
      fontSize: `${fontSize}px`,
    };
    if (isFirefox) {
      return baseStyle;
    }
    return {
      ...baseStyle,
      margintop: "-4px"
    };
  }

  const style = getStyle(rest.width, rest.height, rest.fontSize, rest );

  return (
    <>
      {/* <Rect
        height={HEIGHT}
        width={WIDTH}
        fill={background}
      /> */}
      {
        isEditing ?
          <Html groupProps={{ x: rest.x, y: rest.y }} divProps={{ style: { opacity: 1 } }}>
          <input
            value={text}
            onChange={onTextChange}
            onKeyDown={handleEscapeKeys}
            style={style}
          />
          </Html>
        :
        <Text
          {...rest}
          ref={textRef}
          perfectDrawEnabled={false}
          onTransform={handleResize}
          onClick={OnClick}
          onTap={OnClick}
          onDblClick={toogleIsEditing}
          onDblTap={toogleIsEditing}
          text={text}
        />
      }
      {transformer}
    </>
  )
}

