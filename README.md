Used useRef for elems: We store the elems array in useRef to prevent it from causing unnecessary re-renders.

Moved elemsRef initialization outside useEffect: This ensures that the elements are initialized only once, and their state is preserved between renders.

Handled resize and pointermove event listeners properly to ensure they are cleaned up during unmount.