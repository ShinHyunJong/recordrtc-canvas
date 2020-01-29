/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyledCanvas } from './styles';

const CustomCanvas = ({
  canvasWrapperRef,
  image,
  canvasRef,
  pageList,
  selectedStream,
  onLeaveMouse,
  onDraw,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [log, setLog] = useState({ last: [], current: [] });

  const getCanvas = () => {
    const canvas = canvasRef.current;
    return canvas;
  };

  const getCtx = () => getCanvas().getContext('2d');

  const setFillWidth = () => {
    const canvas = getCanvas();
    const canvasWrapperWidth = canvasWrapperRef.current.clientWidth;
    const canvasWrapperHeight = canvasWrapperRef.current.clientHeight;
    canvas.width = canvasWrapperWidth;
    canvas.height = canvasWrapperHeight;
    canvas.style.width = canvasWrapperWidth;
    canvas.style.height = canvasWrapperHeight;
    return {
      parentWidth: canvasWrapperWidth,
      parentHeight: canvasWrapperHeight,
    };
  };

  const draw = e => {
    const ctx = getCtx();
    if (isDrawing) {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
      setLastX(e.nativeEvent.offsetX);
      setLastY(e.nativeEvent.offsetY);

      // 마지막 포인트 배열에서 중복 제거.

      const filtered = log.last.filter(c => c.x === lastX && c.y === lastY);
      let newPoint;
      if (filtered.length === 0) {
        const lastLog = [...log.last, { x: lastX, y: lastY }];
        const currentLog = [
          ...log.current,
          {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
          },
        ];
        newPoint = { last: lastLog, current: currentLog };
      } else if (filtered.length !== 0) {
        newPoint = log;
      }
      setLog(newPoint);
      onDraw(newPoint);
    }
  };
  const onMouseOut = () => {
    // const filtered = log.last.filter(c => c.x === lastX && c.y === lastY);
    // let newPoint;
    // if (filtered.length === 0 || log.last.length === 0) {
    //   const lastLog = [
    //     ...log.last,
    //     {
    //       x: lastX,
    //       y: lastY,
    //     },
    //   ];
    //   const currentLog = [
    //     ...log.current,
    //     {
    //       x: e.nativeEvent.offsetX,
    //       y: e.nativeEvent.offsetY,
    //     },
    //   ];
    //   newPoint = {
    //     last: lastLog,
    //     current: currentLog,
    //   };
    // } else if (filtered.length !== 0) {
    //   newPoint = log;
    // }
    // setLog(newPoint);
    setIsDrawing(false);
  };

  useLayoutEffect(() => {
    const ctx = getCtx();
    ctx.strokeStyle = '#BADA55';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
  }, []);

  // useEffect(() => {
  //   const ctx = getCtx();
  //   const { parentWidth, parentHeight } = setFillWidth();
  //   ctx.fillStyle = pageList[0].color;
  //   ctx.fillRect(0, 0, parentWidth, parentHeight);
  // }, [canvasWrapperRef]);

  useEffect(() => {
    if (!image) return;
    const { parentWidth, parentHeight } = setFillWidth();
    const ctx = getCtx();
    const newImage = new Image(parentWidth, 'auto');
    newImage.onload = () => {
      ctx.drawImage(newImage, 0, 0, parentWidth, parentHeight);
    };
    newImage.src = image.base64;
  }, [image]);

  useEffect(() => {
    // 맨 처음일땐 return;
    const ctx = getCtx();
    const { parentWidth, parentHeight } = setFillWidth();
    ctx.fillStyle = selectedStream.color;
    ctx.fillRect(0, 0, parentWidth, parentHeight);

    const { point } = selectedStream;
    if (point.last.length !== 0) {
      const iter = selectedStream.point.last.length;
      for (let i = 0; i < iter; i++) {
        ctx.beginPath();
        ctx.moveTo(point.last[i].x, point.last[i].y);
        ctx.lineTo(point.current[i].x, point.current[i].y);
        ctx.stroke();
      }
      // selectedStream.point.keys.forEach(c => {
      //   const iter = selectedStream.point.keys[c].length;
      //   for(i = 0; i<iter; i++){
      //   ctx.beginPath();
      //   ctx.moveTo(., c.last.y);
      //   ctx.lineTo(c.x, c.y);
      //   ctx.stroke();
      //   }

      // });
    }
  }, [selectedStream]);

  return (
    <StyledCanvas
      ref={canvasRef}
      id="draw"
      onMouseMove={draw}
      onMouseDown={e => {
        setIsDrawing(true);
        setLastX(e.nativeEvent.offsetX);
        setLastY(e.nativeEvent.offsetY);
      }}
      onMouseUp={() => setIsDrawing(false)}
      onMouseOut={onMouseOut}
    />
  );
};

export default CustomCanvas;
