/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Line, Text, Rect, FastLayer, Image } from 'react-konva';
import { fromJS } from 'immutable';
import { StyledCanvas, Wrapper } from './styles';
import Controller from './Controller';
import { useResize } from '../../utils/hooks';

const initialLogState = {
  points: [],
  drawTag: 0,
  lineWidth: 3,
  lineColor: '#696969',
};

const customWidth = 1280;
const customHeight = 720;

const CustomCanvas = ({
  canvasWrapperRef,
  canvasRef,
  selectedStream,
  onDraw,
  unDo,
  reDo,
  onChangeImage,
}) => {
  const wrapperRef = useRef(null);
  const stageRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [undoClicked, setUndoClicked] = useState(false);
  const [log, setLog] = useState([]);
  const [_deletedLog, setDeletedLog] = useState([]);
  const [drawTag, setDrawTag] = useState(initialLogState.drawTag);
  const [controlDisplay, setControlDisplay] = useState(true);
  const [_lineWidth, setLineWidth] = useState(initialLogState.lineWidth);
  const [_lineColor, setLineColor] = useState(initialLogState.lineColor);
  const [_imageUrl, setImageUrl] = useState(null);

  // useLayoutEffect(() => {
  //   checkSize();
  //   window.addEventListener('resize', checkSize);
  //   return () => {
  //     window.removeEventListener('resize', checkSize);
  //   };
  // }, []);

  useEffect(() => {
    setLog(selectedStream.points);
    setDeletedLog(selectedStream.deletedPoint);
    setImageUrl(selectedStream.imageUrl);
  }, [selectedStream]);

  const getStage = () => {
    const stage = stageRef.current.getStage();
    return stage;
  };

  // const checkSize = () => {
  //   const width = wrapperRef.current.offsetWidth;
  //   setCanvasWrapperWidth(width);
  // };

  const drawLine = () => {
    const stage = getStage();
    const point = stage.getPointerPosition();

    const lastLog = log[log.length - 1];

    let lastLogPoints = log[log.length - 1].points;
    lastLogPoints = lastLogPoints.concat([point.x, point.y]);

    const newLog = {
      ...lastLog,
      points: lastLogPoints,
      drawTag,
      lineColor: _lineColor,
      lineWidth: _lineWidth,
    };

    const currentLogState = [...log];
    currentLogState.splice(log.length - 1, 1, newLog);

    setLog(currentLogState);
    onDraw(currentLogState);
  };

  const onClickUndo = () => {
    const currentLog = fromJS(log);
    const currentDeleted = fromJS(_deletedLog);
    const logJS = currentLog.toJS();
    const deletedJS = currentDeleted.toJS();

    const logLength = logJS.length;
    if (logLength === 0) return;

    // 맨 마지막 태깅 다 삭제
    const lastDrawTag = logJS[logLength - 1].drawTag;
    const deletedLog = logJS.filter(c => c.drawTag !== lastDrawTag);

    // 삭제한 태깅
    const targetLog = logJS.filter(c => c.drawTag === lastDrawTag);
    // 삭제 로그에 추가한 redo배열
    const newDeletedLog = [...targetLog, ...deletedJS];

    // 로그 바꾸고
    setLog(deletedLog);
    // 삭제된 로그에 추가
    setDeletedLog(newDeletedLog);
    // 각 페이지의 로그 바꾸고
    unDo({ undoLog: deletedLog, redoLog: newDeletedLog });
    setUndoClicked(true);
  };

  const onClickRedo = () => {
    if (!undoClicked) return;
    const currentDeleted = fromJS(_deletedLog);
    const currentLog = fromJS(log);
    const deletedJS = currentDeleted.toJS();
    const logJS = currentLog.toJS();

    if (deletedJS.length === 0) return;

    const targetDrawTag = deletedJS[0].drawTag;

    // 원래 로그에 삭제된 로그의 첫번째 데이터 추가
    const targetFiltered = deletedJS.filter(c => c.drawTag === targetDrawTag);

    const recoveredLog = [...logJS, ...targetFiltered];

    // 삭제된 배열에서 되돌릴 타겟 배열 필터링
    const newDeletedLog = deletedJS.filter(c => c.drawTag !== targetDrawTag);
    setDeletedLog(newDeletedLog);
    setLog(recoveredLog);
    reDo({ undoLog: recoveredLog, redoLog: newDeletedLog });
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
      const image = new window.Image();
      image.src = base64;
      image.onload = () => {
        setImageUrl(image);
        onChangeImage(image);
      };
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
    setLog([
      ...log,
      { points: [], drawTag, lineColor: _lineColor, lineWidth: _lineWidth },
    ]);
  };

  const onTouchMove = () => {
    if (!isDrawing) return;
    drawLine();
  };

  const onTouchEnd = () => {
    setIsDrawing(false);
    setDrawTag(drawTag + 1);
  };

  return (
    <Wrapper ref={wrapperRef}>
      <Stage
        width={960}
        height={540}
        onContentTouchmove={onTouchMove}
        onContentTouchstart={onTouchStart}
        onContentTouchend={onTouchEnd}
        onMouseUp={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={onTouchMove}
        ref={stageRef}
      >
        <FastLayer ref={canvasRef} hitGraphEnabled={false}>
          <Rect width={960} height={540} fill="#ffffff" />

          {_imageUrl ? (
            <Image image={_imageUrl} width={960} height={540} />
          ) : null}
          {log.map((line, i) => (
            <Line
              key={`line-${i}`}
              points={line.points}
              stroke={line.lineColor}
              strokeWidth={line.lineWidth}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </FastLayer>
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
