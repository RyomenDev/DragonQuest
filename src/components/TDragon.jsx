import React, { useEffect, useRef, useState } from "react";
import SVGCanvas from "./SVGCanvas";

const Dragon = ({ color = "#000000" }) => {
  const screenRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [allowCursorMovement, setAllowCursorMovement] = useState(true);

  useEffect(() => {
    const screen = screenRef.current;
    let width, height;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    console.log("hello3");
    let rad = 0;
    let frm = Math.random();
    const N = 40;
    const elems = [];

    const resize = () => {
      console.log("hello2");
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
      //   if (!allowCursorMovement) return;
      console.log("hello1");

      screen.prepend(elem);
    };

    window.addEventListener("resize", resize, false);
    resize();

    const run = () => {
      if (!isAnimating) return;
      requestAnimationFrame(run);
      let e = elems[0];
      const ax = (Math.cos(3 * frm) * rad * width) / height;
      const ay = (Math.sin(4 * frm) * rad * height) / width;
      e.x += (ax + pointer.x - e.x) / 10;
      e.y += (ay + pointer.y - e.y) / 10;

      for (let i = 1; i < N; i++) {
        let e = elems[i];
        let ep = elems[i - 1];
        const a = Math.atan2(e.y - ep.y, e.x - ep.x);
        e.x += (ep.x - e.x + (Math.cos(a) * (100 - i)) / 5) / 4;
        e.y += (ep.y - e.y + (Math.sin(a) * (100 - i)) / 5) / 4;
        const s = (162 + 4 * (1 - i)) / 50;
        e.use.setAttributeNS(
          null,
          "transform",
          `translate(${(ep.x + e.x) / 2},${(ep.y + e.y) / 2}) rotate(${
            (180 / Math.PI) * a
          }) scale(${s},${s})`
        );
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

    if (allowCursorMovement) {
      console.log("hello4", allowCursorMovement);
      window.addEventListener(
        "pointermove",
        (e) => {
          pointer.x = e.clientX;
          pointer.y = e.clientY;
          rad = 0;
        },
        false
      );
    }

    run();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", () => {});
    };
  }, [isAnimating]);

  const toggleAnimation = () => {
    setIsAnimating((prev) => !prev);
    if (!isAnimating) {
      // Restart animation if previously paused
      animationFrameRef.current = requestAnimationFrame(() => {});
    }
  };
  const toggleAllowCursorMovement = () => {
    setAllowCursorMovement((prev) => !prev);
  };

  return (
    <>
      <SVGCanvas screenRef={screenRef} color={color} />
      <button
        onClick={toggleAnimation}
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000, // Ensure it appears above the SVG
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isAnimating ? "Pause" : "Play"} Animation
      </button>
      {/*  */}
      <button
        onClick={toggleAllowCursorMovement}
        style={{
          position: "absolute",
          top: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000, // Ensure it appears above the SVG
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {allowCursorMovement ? "Pause" : "Play"} Movement
      </button>
    </>
  );
};

export default Dragon;
