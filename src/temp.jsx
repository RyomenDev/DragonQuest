import React, { useEffect } from "react";

const xmlns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";

const Dragon = ({ color = "#000000" }) => {
  const screenRef = React.useRef(null);

  useEffect(() => {
    const screen = screenRef.current;
    let width, height;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let rad = 0;
    let frm = Math.random();
    const N = 40;
    const elems = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
    };

    const prepend = (use, i) => {
      const elem = document.createElementNS(xmlns, "use");
      elems[i].use = elem;
      elem.setAttributeNS(xlinkns, "xlink:href", "#" + use);
      screen.prepend(elem);
    };

    window.addEventListener("resize", resize, false);
    resize();

    const run = () => {
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

    window.addEventListener(
      "pointermove",
      (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        rad = 0;
      },
      false
    );

    run();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", () => {});
    };
  }, []);

  return (
    <svg
      ref={screenRef}
      xmlns={xmlns}
      xmlnsXlink={xlinkns}
      viewBox="0 0 800 600"
      style={{ width: "100%", height: "100%" }}
      color=""
    >
      <defs>
        <g id="Cabeza" transform="matrix(1, 0, 0, 1, 0, 0)">
          <path
            // style={{ fill: color }}
            style={{ fill: "#FFFFFF", fillOpacity: 1 }}
            d="M-28.9,-1.1L-28.55 "
          />
          <path
            // style={{ fill: color }}
            style={{ fill: "#000000", fillOpacity: 1 }}
            d="M-21.05,-8.25Q-13.6 "
          />
        </g>
        {/*  */}
        <g id="Aletas" transform="matrix(1, 0, 0, 1, 0, 0)">
          <linearGradient
            id="LinearGradID_1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(0.0935974, 0, 0, 0.188782, -20.55, 0)"
            spreadMethod="pad"
            x1="-819.2"
            y1="0"
            x2="819.2"
            y2="0"
          >
            <stop offset="0" style={{ stopColor: "#CCCCCC", stopOpacity: 1 }} />
            <stop offset="1" style={{ stopColor: "#000000", stopOpacity: 1 }} />
          </linearGradient>
          <path
            style={{ fill: "url(#LinearGradID_1)" }}
            d="M29.75,-36.85Q-17.75 "
          />
        </g>
        {/*  */}
        <g id="Espina" transform="matrix(1, 0, 0, 1, 0, 0)">
          <linearGradient
            id="LinearGradID_2"
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(0.0229492, 0, 0, -0.0152893, 0, 0.05)"
            spreadMethod="pad"
            x1="-819.2"
            y1="0"
            x2="819.2"
            y2="0"
          >
            <stop offset="0" style={{ stopColor: "#CCCCCC", stopOpacity: 1 }} />
            <stop offset="1" style={{ stopColor: "#333333", stopOpacity: 1 }} />
          </linearGradient>
          <path
            style={{ fill: "url(#LinearGradID_2)" }}
            d="M-18.8,0Q-17.85 -"
          />
          <linearGradient
            id="LinearGradID_3"
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(0.0229492, 0, 0, 0.0152893, 0, -0.05)"
            spreadMethod="pad"
            x1="-819.2"
            y1="0"
            x2="819.2"
            y2="0"
          >
            <stop offset="0" style={{ stopColor: "#CCCCCC", stopOpacity: 1 }} />
            <stop offset="1" style={{ stopColor: "#333333", stopOpacity: 1 }} />
          </linearGradient>
          <path
            style={{ fill: "url(#LinearGradID_3)" }}
            d="M18.8,0Q18 1.45 7.75 4.1Q2.7 2"
          />
        </g>
      </defs>
      <g id="screen" />
    </svg>
  );
};

export default Dragon;
