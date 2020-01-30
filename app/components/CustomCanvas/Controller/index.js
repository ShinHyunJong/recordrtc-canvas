import React from 'react';
import PropTypes from 'prop-types';
import { ControllerWrapper, ControllerHeader, ControllerBody } from './styles';

function Controller({
  display,
  onChangeLineWidth,
  lineWidth,
  onChangeLineColor,
  lineColor,
  toggleControls,
  onClickUndo,
  onClickRedo,
  onChangeFile,
}) {
  return (
    <ControllerWrapper display={display.toString()}>
      <ControllerHeader onClick={toggleControls}>
        <ControllerHeader.Title>설정</ControllerHeader.Title>
      </ControllerHeader>
      <ControllerBody>
        이미지
        <input type="file" name="file" onChange={onChangeFile} />
        펜 굵기
        <input
          value={lineWidth}
          onChange={onChangeLineWidth}
          type="range"
          min="1"
          max="40"
          step="1"
        />
        색깔
        <input value={lineColor} type="color" onChange={onChangeLineColor} />
        <button onClick={onClickUndo}>실행취소</button>
        <button onClick={onClickRedo}>다시실행</button>
      </ControllerBody>
    </ControllerWrapper>
  );
}

Controller.propTypes = {
  display: PropTypes.bool,
  lineWidth: PropTypes.number,
  onChangeLineWidth: PropTypes.func,
  lineColor: PropTypes.string,
  onChangeLineColor: PropTypes.func,
};

export default Controller;
