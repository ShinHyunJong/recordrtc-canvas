import { useState, useEffect } from 'react';
// Hook
export function useResize(element = null) {
  let [
    { screenWidth, screenHeight, ratiowh, ratiohw, rect },
    setState,
  ] = useState({
    screenWidth: 0,
    screenHeight: 0,
    ratiowh: 0,
    ratiohw: 0,
    rect: undefined,
  });

  const onResize = event => {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    ratiowh = screenWidth / screenHeight;
    ratiohw = screenHeight / screenWidth;

    if (element && element.current) {
      // rect = element.current.getBoundingClientRect();
      const clientRect = element.current.getBoundingClientRect();

      // DOM API does not allow for a shallow copy, so we have to manually set them
      rect = {
        width: clientRect.width,
        height: clientRect.height,
        left: clientRect.left,
        right: clientRect.right,
        top: clientRect.top,
        bottom: clientRect.bottom,
      };
    }

    setState({ screenWidth, screenHeight, ratiowh, ratiohw, rect });
  };

  useEffect(() => {
    window.addEventListener('resize', onResize, false);
    onResize();
    return () => {
      window.removeEventListener('resize', onResize, false);
    };
    // [] ==> let only resize:event handle state update
  }, []);

  return { screenWidth, screenHeight, ratiowh, ratiohw, rect };
}
