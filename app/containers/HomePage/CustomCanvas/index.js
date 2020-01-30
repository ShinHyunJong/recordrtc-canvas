/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { fromJS, set } from 'immutable';
import { StyledCanvas, ControlWrapper } from './styles';
import PenIcon from '../../../images/pen.png';
import Controller from './Controller';

const initialLogState = { last: [], current: [], drawTag: 0 };

const CustomCanvas = ({
  canvasWrapperRef,
  image,
  canvasRef,
  pageList,
  selectedStream,
  onLeaveMouse,
  onDraw,
  unDo,
  reDo,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [log, setLog] = useState(initialLogState);
  const [deletedLog, setDeletedLog] = useState(initialLogState);
  const [drawTag, setDrawTag] = useState(initialLogState.drawTag);
  const [controlDisplay, setControlDisplay] = useState('none');
  const [controlLeft, setControlLeft] = useState('100%');
  const [strokeWidth, setStrokeWidth] = useState();

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

  const setBlank = () => {
    const ctx = getCtx();
    const { parentWidth, parentHeight } = setFillWidth();
    ctx.fillStyle = selectedStream.color;
    ctx.fillRect(0, 0, parentWidth, parentHeight);
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
        const lastLog = [...log.last, { x: lastX, y: lastY, drawTag }];
        const currentLog = [
          ...log.current,
          {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
            drawTag,
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

  const onMouseDown = e => {
    const ctx = getCtx();
    ctx.beginPath();
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    setIsDrawing(true);
    setLastX(e.nativeEvent.offsetX);
    setLastY(e.nativeEvent.offsetY);
  };

  const onMouseUp = () => {
    setIsDrawing(false);
    setDrawTag(drawTag + 1);
  };

  const onMouseOut = () => {
    setIsDrawing(false);
  };

  const drawPoints = point => {
    const ctx = getCtx();
    const iter = point.last.length;
    for (let i = 0; i < iter; i += 1) {
      ctx.beginPath();
      ctx.moveTo(point.last[i].x, point.last[i].y);
      ctx.lineTo(point.current[i].x, point.current[i].y);
      ctx.stroke();
    }
  };

  const onClickUndo = () => {
    const currentLog = fromJS(log);
    const currentDeleted = fromJS(deletedLog);
    const logJS = currentLog.toJS();
    const targetJS = currentDeleted.toJS();

    const pointLength = logJS.last.length;
    if (pointLength === 0) return;

    // 맨 마지막 태깅 다 삭제
    const lastDrawTag = logJS.last[pointLength - 1].drawTag;
    const deletedLast = logJS.last.filter(c => c.drawTag !== lastDrawTag);
    const deletedCurrent = logJS.current.filter(c => c.drawTag !== lastDrawTag);

    // 삭제한 태깅
    const targetLast = logJS.last.filter(c => c.drawTag === lastDrawTag);
    const targetCurrent = logJS.current.filter(c => c.drawTag === lastDrawTag);

    const newLog = { last: deletedLast, current: deletedCurrent };
    const targetLog = {
      last: [...targetLast, ...targetJS.last],
      current: [...targetCurrent, ...targetJS.current],
    };

    // 로그 바꾸고
    setLog(newLog);
    // 삭제된 로그에 추가
    setDeletedLog(targetLog);
    // 각 페이지의 로그 바꾸고
    unDo({ undoLog: newLog, redoLog: targetLog });
    // 빈 종이 세팅
    setBlank();
    // 이전 배열 그림
    drawPoints(newLog);
  };

  const onClickRedo = () => {
    const currentDeleted = fromJS(deletedLog);
    const currentLog = fromJS(log);
    const targetJS = currentDeleted.toJS();
    const logJS = currentLog.toJS();

    if (targetJS.last.length === 0) return;

    const targetDrawTag = targetJS.last[0].drawTag;

    // 원래 로그에 삭제된 로그의 첫번째 데이터 추가
    const lastFiltered = targetJS.last.filter(c => c.drawTag === targetDrawTag);

    const recoveredLast = [...logJS.last, ...lastFiltered];

    const currentFiltered = targetJS.current.filter(
      c => c.drawTag === targetDrawTag,
    );
    const recoveredCurrent = [...logJS.current, ...currentFiltered];

    // 삭제된 배열에서 되돌릴 타겟 배열 필터링
    const newDeletedLast = targetJS.last.filter(
      c => c.drawTag !== targetDrawTag,
    );
    const newDeletedCurrent = targetJS.current.filter(
      c => c.drawTag !== targetDrawTag,
    );

    const newDeletedLog = {
      last: newDeletedLast,
      current: newDeletedCurrent,
    };

    setDeletedLog(newDeletedLog);
    const recoveredPoint = {
      last: recoveredLast,
      current: recoveredCurrent,
    };
    setLog(recoveredPoint);
    reDo({ undoLog: recoveredPoint, redoLog: newDeletedLog });
    setBlank();
    drawPoints(recoveredPoint);
  };

  const toggleControls = () => {
    const onScreen = controlLeft;
    const display = controlDisplay;
    const fade = () => {
      if (onScreen === '0%') {
        setControlLeft('100%');
      } else {
        setControlLeft('0%');
      }
    };
    if (
      (display === 'none' && onScreen === '100%') ||
      (display === 'block' && onScreen === '0%')
    ) {
      if (display === 'none') {
        setControlDisplay('block');
        setTimeout(() => fade(), 0);
      } else {
        fade();
        setTimeout(() => setControlDisplay('none'), 500);
      }
    }
  };

  const onChangeStrokeWidth = e => {
    setStrokeWidth(e.target.value);
    const ctx = getCtx();
    ctx.lineWidth = Number(e.target.value);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
  };

  useLayoutEffect(() => {
    const ctx = getCtx();
    ctx.strokeStyle = '#BADA55';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
  }, []);

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
    // 처음 로그 초기화
    setLog(selectedStream.point);
    setDeletedLog(selectedStream.deletedPoint);
    setBlank();
    const { point } = selectedStream;
    if (point.last.length !== 0) {
      drawPoints(point);
    }
  }, [selectedStream]);

  return (
    <>
      <StyledCanvas
        ref={canvasRef}
        id="draw"
        onMouseMove={draw}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseOut={onMouseOut}
      />
      <Controller
        left={controlLeft}
        display={controlDisplay}
        onChangeStrokeWidth={onChangeStrokeWidth}
      />
      <ControlWrapper>
        <button onClick={toggleControls}>펜설정</button>
        <button onClick={onClickUndo}>실행취소</button>
        <button onClick={onClickRedo}>다시실행</button>
      </ControlWrapper>
    </>
  );
};

export default CustomCanvas;
