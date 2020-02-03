import { useState, useEffect } from 'react';

const getScreenSize = element =>
  // if (!element.current) {
  //   return { width: 900, height: 700 };
  // }
  ({
    width: element.current.offsetWidth,
    height: element.current.offsetHeight,
  });
export const useResize = element => {
  const [size, setSize] = useState({ width: 900, height: 700 });
  useEffect(() => {
    const onResize = () => setSize(getScreenSize(element));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
};
