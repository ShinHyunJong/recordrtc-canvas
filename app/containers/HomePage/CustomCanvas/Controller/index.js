import React from 'react';
import { ControllerWrapper, ControllerContent } from './styles';

function StrokeWidth({ onChangeStrokeWidth }) {
  const strokeControlStyle = {
    display: 'flex',
    flexDirection: 'row',
  };
  const inputStyle = {
    display: 'block',
  };
  return (
    <div style={strokeControlStyle}>
      <input
        style={inputStyle}
        name="minWidth"
        onChange={onChangeStrokeWidth}
        type="range"
        min="1"
        max="150"
        step="1"
      />
    </div>
  );
}

function Controller({ display, left, onChangeStrokeWidth }) {
  const content = {
    backgroundColor: 'rgb(47, 47, 47)',
    color: 'white',
    boxSizing: 'border-box',
    boxShadow: 'rgba(0, 0, 0, 0.28) 0px 1px 2px 2px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    padding: '10px',
    borderRadius: '0 0 5px 5px',
    position: 'absolute',
    left: `${left || 0}`,
    transition: '0.5s ease',
  };
  return (
    <ControllerWrapper display={display}>
      <ControllerContent left={left}>
        <StrokeWidth onChangeStrokeWidth={onChangeStrokeWidth} />
        {/* <ColorCheckbox
          checked={props.customColor}
          handleChange={props.handleInputChange}
        />
        {props.customColor && (
          <ColorPicker
            color={props.color}
            handleChange={props.handleInputChange}
          />
        )} */}
      </ControllerContent>
    </ControllerWrapper>
  );
}

export default Controller;
