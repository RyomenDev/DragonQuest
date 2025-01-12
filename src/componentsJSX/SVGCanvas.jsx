import React from "react";
import Defs from "./Defs";

const SVGCanvas = ({ screenRef, color }) => {
  return (
    <svg
      ref={screenRef}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 800 600"
      style={{ width: "100%", height: "100%" }}
    >
      <Defs color={color} />
      {/* <Defs color="black" /> */}
      <g id="screen" />
    </svg>
  );
};

export default SVGCanvas;
