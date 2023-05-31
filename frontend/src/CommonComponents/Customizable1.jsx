import React, { useState, useEffect, useRef } from "react";
import { Group, Rect, Text, Transformer } from "react-konva";
// import { EditableText } from "./EditableText";
import { Html } from "react-konva-utils";

export function CustomizableText({
  background,
  text,
  x,
  y,
  width,
  height,
  fontSize,
  onClick,
  onTextResize,
  onTextChange,
  selected,
  onTextClick,
  draggable,
  getSelectedText,
  onDragEnd,
  ...rest
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);

  useEffect(() => {
    if (!selected && isEditing) {
      setIsEditing(false);
    } else if (!selected && isTransforming) {
      setIsTransforming(false);
    }
  }, [selected, isEditing, isTransforming]);

  function toggleEdit() {
    setIsEditing(!isEditing);
    onTextClick(!isEditing);
  }

  function toggleTransforming(e) {
    e && getSelectedText(e)
    setIsTransforming(!isTransforming);
    onTextClick(!isTransforming);
  }

  function handleEscapeKeys(e) {
    const RETURN_KEY = 13;
    const ESCAPE_KEY = 27;
    if ((e.keyCode === RETURN_KEY && !e.shiftKey) || e.keyCode === ESCAPE_KEY) {
      toggleEdit(e);
    }
  }

  function handleTextChange(e) {
    onTextChange(e.currentTarget.value);
  }

  function getStyle(width, height, fontSize=30) {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    const baseStyle = {
      width: `${width}px`,
      // height: `${height}px`,
      border: "none",
      padding: "0px",
      margin: "0px",
      background: "none",
      outline: "none",
      resize: "none",
      // borderBottom: 'solid 1px',
      colour: "black",
      fontSize: `${fontSize}px`,
      fontFamily: "sans-serif"
    };
    if (isFirefox) {
      return baseStyle;
    }
    return {
      ...baseStyle,
      margintop: "-4px"
    };
  }

  const style = getStyle(width, height, fontSize );

  // Resizable Text 

  const textRef = useRef(null);
  const transformerRef = useRef(null);
  const groupRef = useRef(null);

  useEffect(() => {
    if (isTransforming && transformerRef.current !== null) {
      // transformerRef.current.nodes([textRef.current]);
      transformerRef.current.node(groupRef.current);

      transformerRef.current.getLayer().batchDraw();
    }
  }, [isTransforming]);

  function handleResize(e) {
    if (textRef.current !== null && onTextResize) {
      const textNode = textRef.current;
      const newWidth = textNode.width() * textNode.scaleX();
      const newHeight = textNode.height() * textNode.scaleY();
      textNode.setAttrs({
        width: newWidth,
        height: newHeight,
        scaleX: 1,
        screenY: 1,
      });
      // groupRef.current?.setAttrs({
      //   width: newWidth,
      //   height: newHeight,
      //   scaleX: 1,
      //   scaleY: 1,
      // })
      onTextResize(newWidth, newHeight);
    }
    console.log(e);
    // if (textRef.current !== null && onTextResize) {
    //   console.log('wi,he', textRef.current.width(), textRef.current.height())
    //   const textNode = textRef.current;
    //   const newWidth = textNode.width() * textNode.scaleX();
    //   const newHeight = textNode.height() * textNode.scaleY();
    //   textNode.current?.setAttrs({
    //     width: newWidth,
    //     height: newHeight,
    //     scaleX: 1,
    //     scaleY: 1,
    //   });
    //   groupRef.current?.setAttrs({
    //     width: newWidth,
    //     height: newHeight,
    //     scaleX: 1,
    //     scaleY: 1,
    //   })
    //   onTextResize(newWidth, newHeight);
    // }
  }

  useEffect( ()=>{
    handleResize()
  }, [fontSize, text, rest.fontFamily, rest.fontStyle] )

  const transformer = isTransforming && !isEditing ? (
    <Transformer
      ref={transformerRef}
      rotateEnabled={false}
      flipEnabled={false}
      centeredScaling={true}
      // enabledAnchors={["middle-left", "middle-right", 'top-left', 'top-right', 'bottom-left', 'bottom-right',  'bottom-center', 'top-center']}
      enabledAnchors={["middle-left", "middle-right", 'top-left', 'top-right', 'bottom-left', 'bottom-right',  'bottom-center']}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 30 || newBox.height < 10) {
          return oldBox;
        }
        console.log('new', newBox)
        return newBox;
      }}
    />
  ) : null;


  return (
    <>
    <Group x={x} onTransform={handleResize} y={y} draggable={draggable} ref={groupRef} onDragEnd={onDragEnd} dataId={rest.dataId} >
      <Rect
        x={0}
        y={0}
        width={(width || 20) }
        height={(height || 20)}
        fill={background}
        onClick={onClick}
      />

    {
      isEditing ?
        <Html 
          // groupProps={{ x, y }} 
          divProps={{ 
            style: { opacity: 1 } 
          }}
        >
        <textarea
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleEscapeKeys}
          style={style}
        />
        </Html>
      :
      <Text
        // x={x}
        // y={y}
        ref={textRef}
        text={text}
        fill="black"
        fontFamily="sans-serif"
        fontSize={fontSize}
        perfectDrawEnabled={false}
        // onTransform={handleResize}
        onClick={toggleTransforming}
        onTap={toggleTransforming}
        onDblClick={toggleEdit}
        onDblTap={toggleEdit}
        width={width}
        scaleX={1}
        scaleY={1}
        {...rest}
      />
    }
    
      
    
  
      {/* <EditableText
        x={0}
        y={0}
        text={text}
        width={width}
        height={height}
        onResize={onTextResize}
        isEditing={isEditing}
        isTransforming={isTransforming}
        onToggleEdit={toggleEdit}
        onToggleTransform={toggleTransforming}
        onChange={onTextChange}
        {...rest}
      /> */}
    </Group>
    {transformer}
    </>
  );
}
