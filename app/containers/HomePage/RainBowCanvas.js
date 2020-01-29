import React, { createRef } from 'react';
import styled from 'styled-components';
import SampleImg from '../../images/sample.png';
import _ from 'lodash';

const Canvas = styled.canvas`
  border: 1px solid blue;
  /* width: 100%;
  height: 100%; */
`;

class RainbowCanvas extends React.Component {
  constructor(props) {
    super(props),
      (this.state = {
        isDrawing: false,
        lastX: 0,
        lastY: 0,
        hue: 1,
        direction: true,
        controlDisplay: 'none',
        controlLeft: '100%',
        customColor: false,
        color: '#000000',
        customStroke: true,
        maxWidth: 100,
        minWidth: 5,
        image: null,
      }),
      (this.draw = this.draw.bind(this)),
      (this.handleWidth = this.handleWidth.bind(this)),
      (this.toggleControls = this.toggleControls.bind(this));
    this.handleInputChange = this.handleInputChange.bind(this);
    this.imageRef = createRef(null);
  }

  canvas() {
    const canvas = document.querySelector('#draw');
    return canvas;
  }

  ctx() {
    return this.canvas().getContext('2d');
  }

  componentDidMount() {
    const canvas = this.canvas();
    const ctx = this.ctx();
    if (this.props.fullscreen === true) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    ctx.strokeStyle = '#BADA55';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = Number(this.state.minWidth) + 1;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevProps.image, this.props.image)) {
      const canvas = this.canvas();
      console.log(this.props.image)
      const { canvasWrapperRef } = this.props;
      const canvasWrapperWidth = canvasWrapperRef.current.offsetWidth;
      const canvasWrapperHeight = canvasWrapperRef.current.offsetHeight;
      canvas.width = canvasWrapperWidth;
      canvas.height = canvasWrapperHeight;
      canvas.style.width = canvasWrapperWidth;
      canvas.style.height = canvasWrapperHeight;
      const ctx = this.ctx();
      const image = new Image(canvasWrapperWidth, 'auto');
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvasWrapperWidth, canvasWrapperHeight);
        
        // context.drawImage(imageObj, 0, 0, 100, 100 * imageObj.height / imageObj.width)
      };
      image.src = this.props.image.base64;
    }
  }

  draw(e) {
    const ctx = this.ctx();
    let { hue } = this.state;

    if (this.state.isDrawing) {
      if (this.state.color && this.state.customColor) {
        ctx.strokeStyle = this.state.color;
      } else {
        ctx.strokeStyle = `hsl(${this.state.hue}, 100%, 50%)`;
      }
      ctx.beginPath();
      ctx.moveTo(this.state.lastX, this.state.lastY);
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
      hue++;
      if (hue >= 360) {
        hue = 1;
      }
      this.setState({
        hue,
        lastX: e.nativeEvent.offsetX,
        lastY: e.nativeEvent.offsetY,
      });
      if (!this.state.customStroke) {
        this.handleWidth(e);
      }
    }
  }

  handleWidth(e) {
    const ctx = this.canvas().getContext('2d');
    let nextState = this.state.direction;
    if (
      (ctx.lineWidth >= this.state.maxWidth && this.state.direction === true) ||
      (ctx.lineWidth <= this.state.minWidth && this.state.direction === false)
    ) {
      nextState = !this.state.direction;
      this.setState({
        direction: nextState,
      });
    }
    if (nextState) {
      ctx.lineWidth++;
    } else {
      ctx.lineWidth--;
    }
  }

  toggleControls() {
    const onScreen = this.state.controlLeft;
    const display = this.state.controlDisplay;
    const fade = () => {
      onScreen === '0%'
        ? this.setState({ controlLeft: '100%' })
        : this.setState({ controlLeft: '0%' });
    };
    if (
      (display === 'none' && onScreen === '100%') ||
      (display === 'block' && onScreen === '0%')
    ) {
      if (display === 'none') {
        this.setState({ controlDisplay: 'block' });
        setTimeout(() => fade(), 0);
      } else {
        fade();
        setTimeout(() => this.setState({ controlDisplay: 'none' }), 500);
      }
    }
  }

  handleInputChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value,
    });

    if (name === 'minWidth' || name === 'maxWidth') {
      this.ctx().lineWidth = Number(this.state.minWidth) + 1;
    }
    if (name === 'customStroke' && value === true) {
      this.ctx().lineWidth = this.state.minWidth;
    } else if (name === 'customStroke' && value === false) {
      this.ctx().lineWidth = Number(this.state.minWidth) + 1;
    }
  }

  render() {
    return (
      <>
        <Canvas
          ref={this.props.canvasRef}
          id="draw"
          onMouseMove={this.draw}
          onMouseDown={e => {
            this.setState({
              isDrawing: true,
              lastX: e.nativeEvent.offsetX,
              lastY: e.nativeEvent.offsetY,
            });
          }}
          onMouseUp={() => this.setState({ isDrawing: false })}
          onMouseOut={() => this.setState({ isDrawing: false })}
        />
        <Controls
          left={this.state.controlLeft}
          display={this.state.controlDisplay}
          canvas={this.canvas}
          ctx={this.ctx}
          color={this.state.color}
          customColor={this.state.customColor}
          handleInputChange={this.handleInputChange}
          maxWidth={this.state.maxWidth}
          minWidth={this.state.minWidth}
          fixedWidth={this.state.customStroke}
        />
        <ButtonOptions onClick={this.toggleControls} />
      </>
    );
  }
}

function ButtonOptions(props) {
  const buttonStyle = {
    textAlign: 'center',
    position: 'absolute',
    right: '10px',
    top: '10px',
    cursor: 'pointer',
    padding: '8px',
    color: 'white',
    backgroundColor: 'rgb(47, 47, 47)',
    border: '3px solid red',
    boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.47)',
  };
  return (
    <div onClick={props.onClick} style={buttonStyle}>
      <i className="fa fa-cogs" aria-hidden="true" />
    </div>
  );
}

function ClearCanvas(props) {
  const buttonStyle = {
    display: 'block',
    float: 'right',
    border: '1px solid #840000',
    backgroundColor: '#ff2929',
    cursor: 'pointer',
  };
  const clear = () => {
    props.ctx().clearRect(0, 0, props.canvas().width, props.canvas().height);
  };
  return (
    <button style={buttonStyle} onClick={clear}>
      Clear Canvas
    </button>
  );
}

function ColorCheckbox(props) {
  return (
    <div>
      <label>
        <input
          name="customColor"
          type="checkbox"
          onChange={props.handleChange}
          value={props.checked}
        />
        Custom Color
      </label>
    </div>
  );
}

function ColorPicker(props) {
  return (
    <input
      name="color"
      type="color"
      onChange={props.handleChange}
      value={props.color}
    />
  );
}
function StrokeCheckbox(props) {
  return (
    <div>
      <label>
        <input
          name="customStroke"
          type="checkbox"
          onChange={props.handleChange}
          value={props.checked}
        />
        Fixed Stroke Width
      </label>
    </div>
  );
}

function StrokeWidth(props) {
  const strokeControlStyle = {
    display: 'flex',
    flexDirection: 'row',
  };
  const inputStyle = {
    display: 'block',
  };
  return (
    <div style={strokeControlStyle}>
      <label>
        {props.fixedWidth ? 'Fixed' : 'min'} Stroke Width
        <input
          style={inputStyle}
          name="minWidth"
          type="range"
          onChange={props.handleChange}
          value={props.minWidth}
          min="1"
          max="150"
          step="1"
        />
      </label>
      {!props.fixedWidth && (
        <label>
          max Stroke Width
          <input
            style={inputStyle}
            name="maxWidth"
            type="range"
            onChange={props.handleChange}
            value={props.maxWidth}
            min="1"
            max="150"
            step="1"
          />
        </label>
      )}
    </div>
  );
}
// to-do:

function Controls(props) {
  const container = {
    position: 'absolute',
    right: '70px',
    top: '0',
    backgroundColor: 'transparent',
    width: '400px',
    height: '150px',
    overflow: 'hidden',
    borderRadius: '0 0 5px 5px',
    display: `${props.display || inlineBlock}`,
  };
  const content = {
    backgroundColor: 'rgb(47, 47, 47)',
    color: 'white',
    boxSizing: 'border-box',
    boxShadow: 'rgba(0, 0, 0, 0.28) 0px 1px 2px 2px',
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    padding: '10px',
    borderRadius: '0 0 5px 5px',
    position: 'absolute',
    left: `${props.left || 0}`,
    transition: '0.5s cubic-bezier(0.22, 0.61, 0.36, 1)',
  };
  return (
    <div style={container}>
      <div style={content}>
        <StrokeWidth
          minWidth={props.minWidth}
          maxWidth={props.maxWidth}
          fixedWidth={props.fixedWidth}
          handleChange={props.handleInputChange}
        />
        <ColorCheckbox
          checked={props.customColor}
          handleChange={props.handleInputChange}
        />
        {props.customColor && (
          <ColorPicker
            color={props.color}
            handleChange={props.handleInputChange}
          />
        )}
        <ClearCanvas ctx={props.ctx} canvas={props.canvas} />
      </div>
    </div>
  );
}

export default RainbowCanvas;
