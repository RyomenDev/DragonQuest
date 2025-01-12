import React, { useEffect, useRef, useState } from "react";
import SVGCanvas from "./SVGCanvas";
import Button from "./Button";

const Dragon = ({ color = "#000000" }) => {
  const screenRef = useRef(null);
  //   const animationFrameRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAutoAnimating, setIsAutoAnimating] = useState(false);
  const [allowCursorMovement, setAllowCursorMovement] = useState(true);

  // Handle button clicks and toggle states
  const toggleAnimation = () => {
    console.log("toggleAnimation-clicked");
    setIsAnimating((prev) => !prev);
  };

  const toggleAllowCursorMovement = () => {
    console.log("toggleAllowCursorMovement-clicked");
    setAllowCursorMovement((prev) => !prev);
  };

  useEffect(() => {
    console.log(
      "isAnimating,allowCursorMovement:",
      isAnimating,
      allowCursorMovement
    );

    const screen = screenRef.current;
    let width, height;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let rad = 0;
    let frm = Math.random();
    const N = 40;
    const elems = [];
    let animationFrameId = null;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
    };

    const prepend = (use, i) => {
      const elem = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "use"
      );
      elems[i].use = elem;
      elem.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        "#" + use
      );
      screen.prepend(elem);
    };

    window.addEventListener("resize", resize, false);
    resize();

    const run = () => {
      // If animation is paused, stop further animation frames
      if (!isAnimating) {
        console.log("Animation stopped");
        cancelAnimationFrame(animationFrameId);
        return;
      }
      console.log("Animating", isAnimating);

      // Schedule next frame
      animationFrameId = requestAnimationFrame(run);

      const e = elems[0];
      const ax = (Math.cos(3 * frm) * rad * width) / height;
      const ay = (Math.sin(4 * frm) * rad * height) / width;
      e.x += (ax + pointer.x - e.x) / 10;
      e.y += (ay + pointer.y - e.y) / 10;

      for (let i = 1; i < N; i++) {
        const e = elems[i];
        const ep = elems[i - 1];

        // Ensure x and y are valid numbers
        e.x = isNaN(e.x) ? width / 2 : e.x;
        e.y = isNaN(e.y) ? height / 2 : e.y;
        ep.x = isNaN(ep.x) ? width / 2 : ep.x;
        ep.y = isNaN(ep.y) ? height / 2 : ep.y;

        const dx = e.x - ep.x;
        const dy = e.y - ep.y;
        const a = Math.atan2(dy, dx) || 0;

        e.x += (ep.x - e.x + (Math.cos(a) * (100 - i)) / 5) / 4;
        e.y += (ep.y - e.y + (Math.sin(a) * (100 - i)) / 5) / 4;

        const s = (162 + 4 * (1 - i)) / 50;

        // Apply transformations only if values are valid
        if (!isNaN(e.x) && !isNaN(e.y) && !isNaN(a) && !isNaN(s)) {
          e.use.setAttributeNS(
            null,
            "transform",
            `translate(${(ep.x + e.x) / 2}, ${(ep.y + e.y) / 2}) rotate(${
              (180 / Math.PI) * a
            }) scale(${s}, ${s})`
          );
        }
      }

      if (rad < Math.min(pointer.x, pointer.y) - 20) rad++;
      frm += 0.003;
      if (rad > 60) {
        pointer.x += (width / 2 - pointer.x) * 0.05;
        pointer.y += (height / 2 - pointer.y) * 0.05;
      }
    };

    for (let i = 0; i < N; i++) {
      elems[i] = { use: null, x: width / 2, y: 0 };
      if (i === 1) prepend("Cabeza", i);
      else if (i === 8 || i === 14) prepend("Aletas", i);
      else prepend("Espina", i);
    }

    const pointerMoveHandler = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      rad = 0;
    };

    if (allowCursorMovement) {
      window.addEventListener("pointermove", pointerMoveHandler, false);
    }

    // Start animation when component mounts or updates
    run();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointerMoveHandler);
      cancelAnimationFrame(animationFrameId); // Cleanup on component unmount
    };
  }, [isAnimating, allowCursorMovement]);

  return (
    <>
      <SVGCanvas screenRef={screenRef} color={color} />
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Button
          onClick={toggleAnimation}
          text={isAnimating ? "Pause Animation" : "Play Animation"}
        />
        <Button
          onClick={toggleAllowCursorMovement}
          text={
            allowCursorMovement
              ? "Disable Cursor Movement"
              : "Enable Cursor Movement"
          }
        />
      </div>
    </>
  );
};

export default Dragon;
