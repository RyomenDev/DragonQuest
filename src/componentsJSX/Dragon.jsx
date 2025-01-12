import React, { useEffect, useRef, useState } from "react";
import SVGCanvas from "./SVGCanvas";
import Button from "./Button";

const Dragon = ({ color = "#000000" }) => {
  const screenRef = useRef(null);
  const animationFrameIdRef = useRef(null); // Store animationFrameId in useRef
  const elemsRef = useRef([]); // Use useRef to store elems
  const [isAnimating, setIsAnimating] = useState(false);
  const [allowCursorMovement, setAllowCursorMovement] = useState(true);
  const [isAutoAnimating, setIsAutoAnimating] = useState(true);

  const toggleAnimation = () => {
    setIsAnimating((prev) => !prev);
  };

  const toggleAllowCursorMovement = () => {
    setAllowCursorMovement((prev) => !prev);
  };

  const toggleAutoAnimation = () => {
    setIsAutoAnimating((prev) => !prev);
  };

  useEffect(() => {
    const screen = screenRef.current;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let rad = 0;
    let frm = Math.random();
    const N = 40;

    const resize = () => {
      // Update screen width and height if necessary
    };

    const prepend = (use, i) => {
      const elem = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "use"
      );
      elemsRef.current[i].use = elem;
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
      if (!isAnimating && !isAutoAnimating) {
        cancelAnimationFrame(animationFrameIdRef.current);
        return;
      }

      animationFrameIdRef.current = requestAnimationFrame(run);

      const e = elemsRef.current[0];
      const ax =
        (Math.cos(3 * frm) * rad * window.innerWidth) / window.innerHeight;
      const ay =
        (Math.sin(4 * frm) * rad * window.innerHeight) / window.innerWidth;
      e.x += (ax + pointer.x - e.x) / 10;
      e.y += (ay + pointer.y - e.y) / 10;

      for (let i = 1; i < N; i++) {
        const e = elemsRef.current[i];
        const ep = elemsRef.current[i - 1];

        e.x = isNaN(e.x) ? window.innerWidth / 2 : e.x;
        e.y = isNaN(e.y) ? window.innerHeight / 2 : e.y;
        ep.x = isNaN(ep.x) ? window.innerWidth / 2 : ep.x;
        ep.y = isNaN(ep.y) ? window.innerHeight / 2 : ep.y;

        const dx = e.x - ep.x;
        const dy = e.y - ep.y;
        const a = Math.atan2(dy, dx) || 0;

        e.x += (ep.x - e.x + (Math.cos(a) * (100 - i)) / 5) / 4;
        e.y += (ep.y - e.y + (Math.sin(a) * (100 - i)) / 5) / 4;

        const s = (162 + 4 * (1 - i)) / 50;

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
        pointer.x += (window.innerWidth / 2 - pointer.x) * 0.05;
        pointer.y += (window.innerHeight / 2 - pointer.y) * 0.05;
      }
    };

    const pointerMoveHandler = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      rad = 0;

      // If cursor movement is allowed and auto-animation is disabled, run the animation
      if (allowCursorMovement && !isAutoAnimating) {
        if (!isAnimating) setIsAnimating(true); // Start animation when moving the cursor if it’s not already playing
      }
    };

    if (allowCursorMovement) {
      window.addEventListener("pointermove", pointerMoveHandler, false);
    }

    // Initialize the elements only once
    if (elemsRef.current.length === 0) {
      for (let i = 0; i < N; i++) {
        elemsRef.current[i] = { use: null, x: window.innerWidth / 2, y: 0 };
        if (i === 1) prepend("Cabeza", i);
        else if (i === 8 || i === 14) prepend("Aletas", i);
        else prepend("Espina", i);
      }
    }

    // Handle auto-animation logic
    if ((isAutoAnimating || allowCursorMovement) && isAnimating) {
      run();
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointerMoveHandler);
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [isAnimating, allowCursorMovement, isAutoAnimating]);

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
          text={isAnimating ? "Pause" : "Play"}
          style={{
            backgroundColor: isAnimating ? "#DC3545" : "#28A745", // Red for Pause, Green for Play
            color: "#FFFFFF",
          }}
        />
        {isAnimating && (
          <>
            <Button
              onClick={toggleAllowCursorMovement}
              text={
                allowCursorMovement
                  ? "Disable Cursor Movement"
                  : "Enable Cursor Movement"
              }
              style={{
                backgroundColor: allowCursorMovement ? "#FFC107" : "#17A2B8", // Yellow for Disable, Blue for Enable
                color: "#FFFFFF",
              }}
            />
            <Button
              onClick={toggleAutoAnimation}
              text={
                isAutoAnimating
                  ? "Disable Auto Animation"
                  : "Enable Auto Animation"
              }
              style={{
                backgroundColor: isAutoAnimating ? "#6C757D" : "#007BFF", // Gray for Disable, Blue for Enable
                color: "#FFFFFF",
              }}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Dragon;
