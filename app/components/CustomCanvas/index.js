/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Stage, Layer, Image, Line, Text } from 'react-konva';
import { fromJS } from 'immutable';
import { StyledCanvas, Wrapper } from './styles';
import Controller from './Controller';
import { useResize } from '../../utils/hooks';

const initialLogState = {
  last: [],
  current: [],
  drawTag: 0,
  lineWidth: 5,
  lineColor: '#696969',
};

const customWidth = 1280;
const customHeight = 720;

const CustomCanvas = ({
  canvasWrapperRef,
  canvasRef,
  selectedStream,
  onLeaveMouse,
  onDraw,
  unDo,
  reDo,
  onChangeImage,
}) => {
  const wrapperRef = useRef(null);
  const stageRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [undoClicked, setUndoClicked] = useState(false);
  const [_lastX, setLastX] = useState(0);
  const [_lastY, setLastY] = useState(0);
  const [log, setLog] = useState(initialLogState);
  const [lines, setLines] = useState([]);
  const [deletedLog, setDeletedLog] = useState(initialLogState);
  const [drawTag, setDrawTag] = useState(initialLogState.drawTag);
  const [controlDisplay, setControlDisplay] = useState(true);
  const [_lineWidth, setLineWidth] = useState(initialLogState.lineWidth);
  const [_lineColor, setLineColor] = useState(initialLogState.lineColor);
  const [_imageUrl, setImageUrl] = useState(null);
  const [canvasWrapperWidth, setCanvasWrapperWidth] = useState(0);
  const [canvasWrapperHeight, setCanvasWrapperHeight] = useState(0);

  // useLayoutEffect(() => {
  //   const ctx = getCtx();
  //   ctx.strokeStyle = _lineColor;
  //   ctx.lineWidth = _lineWidth;
  //   ctx.lineJoin = 'round';
  //   ctx.lineCap = 'round';
  // }, []);

  useEffect(() => {
    setCanvasWrapperWidth(canvasWrapperRef.current.offsetWidth);
    setCanvasWrapperHeight(canvasWrapperRef.current.offsetHeight);
  }, [canvasWrapperRef]);

  // useEffect(() => {
  //   // 처음 로그 초기화
  //   setLog(selectedStream.point);
  //   setDeletedLog(selectedStream.deletedPoint);
  //   const { point, imageUrl } = selectedStream;

  //   if (imageUrl) {
  //     drawImage(imageUrl);
  //     if (point.last.length !== 0) {
  //       setTimeout(() => {
  //         drawPoints(point);
  //       }, 0);
  //     }
  //   } else {
  //     setImageUrl(null);
  //     setBlank();
  //     if (point.last.length !== 0) {
  //       drawPoints(point);
  //     }
  //   }
  // }, [selectedStream]);

  const getStage = () => {
    const stage = stageRef.current.getStage();
    return stage;
  };

  const setBlank = () => {
    const ctx = getCtx();
    ctx.fillStyle = selectedStream.color;
    ctx.fillRect(0, 0, customWidth, customHeight);
  };

  const drawImage = imageUrl => {
    // const { parentWidth, parentHeight } = setFullWidth();
    const ctx = getCtx();
    const newImage = new Image(customWidth, 'auto');
    newImage.onload = () => {
      ctx.drawImage(newImage, 0, 0, customWidth, customHeight);
    };
    newImage.src = imageUrl;
    setImageUrl(imageUrl);
  };

  const drawLine = () => {
    const stage = getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine = lastLine.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const draw = e => {
    const canvas = getCanvas();
    console.log(canvas.getPointerPosition);
    const isTouch = e.type === 'touchmove';
    if (isDrawing) {
      const { touchX, touchY } = getTouchPos(e);
      const { offsetX, offsetY } = e.nativeEvent;
      drawLine({
        offsetX: isTouch ? touchX : offsetX,
        offsetY: isTouch ? touchY : offsetY,
      });
      // 마지막 포인트 배열에서 중복 제거.
      const filtered = log.last.filter(
        c => c.offsetX === _lastX && c.offsetY === _lastY,
      );
      let newPoint;
      if (filtered.length === 0) {
        const lastLog = [
          ...log.last,
          {
            offsetX: _lastX,
            offsetY: _lastY,
            drawTag,
            lineWidth: _lineWidth,
            lineColor: _lineColor,
          },
        ];
        const currentLog = [
          ...log.current,
          {
            offsetX: isTouch ? touchX : offsetX,
            offsetY: isTouch ? touchX : offsetY,
            drawTag,
            lineWidth: _lineWidth,
            lineColor: _lineColor,
          },
        ];
        newPoint = { last: lastLog, current: currentLog };
      } else if (filtered.length !== 0) {
        newPoint = log;
      }
      console.log(newPoint);
      setLog(newPoint);
      onDraw(newPoint);
    }
  };

  const onMouseDown = e => {
    const isTouch = e.type === 'touchstart';
    const { touchX, touchY } = getTouchPos(e);
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    drawLine({
      offsetX: isTouch ? touchX : offsetX,
      offsetY: isTouch ? touchY : offsetY,
      isFirst: true,
    });
  };

  const onMouseUp = () => {
    setIsDrawing(false);
    setDrawTag(drawTag + 1);
    setUndoClicked(false);
  };

  const onMouseOut = () => {
    setIsDrawing(false);
  };

  const drawPoints = point => {
    const iter = point.last.length;
    for (let i = 0; i < iter; i += 1) {
      drawLine({
        lastX: point.last[i].offsetX,
        lastY: point.last[i].offsetY,
        offsetX: point.current[i].offsetX,
        offsetY: point.current[i].offsetY,
        lineWidth: point.current[i].lineWidth,
        lineColor: point.current[i].lineColor,
      });
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
    setUndoClicked(true);
    // 빈 종이 세팅

    if (_imageUrl) {
      drawImage(_imageUrl);
      setTimeout(() => {
        drawPoints(newLog);
      }, 0);
    } else {
      setBlank();
    }
    drawPoints(newLog);
  };

  const onClickRedo = () => {
    if (!undoClicked) return;
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

    if (_imageUrl) {
      drawImage(_imageUrl);
      setTimeout(() => {
        drawPoints(recoveredPoint);
      }, 0);
    } else {
      setBlank();
      drawPoints(recoveredPoint);
    }
  };

  const toggleControls = () => {
    setControlDisplay(!controlDisplay);
  };

  const onChangeFile = e => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64 = reader.result;
      drawImage(base64);
      onChangeImage(base64);
    };
  };

  const onChangeLineWidth = e => {
    setLineWidth(Number(e.target.value));
  };

  const onChangeLineColor = e => {
    setLineColor(e.target.value);
  };

  const onTouchStart = () => {
    setIsDrawing(true);
    setLines([...lines, []]);
  };

  const onTouchEnd = () => {
    setIsDrawing(false);
  };

  const onTouchMove = () => {
    if (!isDrawing) return;
    drawLine();
  };

  console.log(lines);

  const { rect } = useResize(wrapperRef);

  console.log(rect);

  return (
    <Wrapper ref={wrapperRef}>
      <Stage
        width={1000}
        height={600}
        onContentTouchmove={onTouchMove}
        onContentTouchstart={onTouchStart}
        onContentTouchend={onTouchEnd}
        style={{ backgroundColor: 'white ' }}
        ref={stageRef}
      >
        <Layer ref={canvasRef}>
          <Text text="Just start drawing" />
          {lines.map((line, i) => (
            <Line key={i} points={line} stroke={_lineColor} />
          ))}
        </Layer>
      </Stage>

      {/* <StyledCanvas
        ref= stageRef}
        id="draw"
        onMouseMove={draw}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseOut={onMouseOut}
        onTouchMove={draw}
        onTouchStart={onMouseDown}
        onTouchEnd={onMouseUp}
        width={customWidth}
        height={customHeight}
      /> */}
      <Controller
        display={controlDisplay}
        lineWidth={_lineWidth}
        onChangeLineWidth={onChangeLineWidth}
        lineColor={_lineColor}
        onChangeLineColor={onChangeLineColor}
        onClickUndo={onClickUndo}
        onClickRedo={onClickRedo}
        onChangeFile={onChangeFile}
        toggleControls={toggleControls}
      />
    </Wrapper>
  );
};

export default CustomCanvas;
