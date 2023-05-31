import React from "react";
import { Html } from "react-konva-utils";

function getStyle(width, height, fontSize) {
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

export function EditableTextInput({
  x,
  y,
  width,
  height,
  fontSize,
  value,
  onChange,
  onKeyDown
}) {
  const style = getStyle(width, height, fontSize );
  return (
    <Html groupProps={{ x, y }} divProps={{ style: { opacity: 1 } }}>
      <input
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={style}
      />
    </Html>
  );
}
