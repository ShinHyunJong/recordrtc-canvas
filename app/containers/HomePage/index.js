/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useRef, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { fromJS } from 'immutable';
import messages from './messages';
import CustomCanvas from './CustomCanvas';
import {
  Wrapper,
  LeftWrapper,
  RightWrapper,
  PanWrapper,
  CanvasWrapper,
  PaginationWrapper,
} from './styles';

export const Video = styled.video``;
const initialState = {
  id: 0,
  color: 'skyblue',
  point: { last: [], current: [] },
};
export default function HomePage() {
  const { RecordRTC, getTracks } = window;
  const canvasEl = useRef(null);
  const canvasWrapperRef = useRef(null);
  const [recorder, setRecorder] = useState(null);
  const [_audioStream, setAudioStream] = useState(null);
  const [_canvasStream, setCanvasStream] = useState(null);
  const [_blob, setBlob] = useState(null);
  const [_image, setImage] = useState(null);
  const [pageList, setPageList] = useState([initialState]);
  const [selectedStream, setSelectedStream] = useState(initialState);

  // useEffect(() => {
  //   const cRef = canvasEl.current;
  // }, [canvasEl]);

  const onClickStart = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(audioStream => {
      setAudioStream(audioStream);
      const canvas = canvasEl.current;
      const canvasStream = canvas.captureStream(10);
      setCanvasStream(canvasStream);

      const finalStream = new MediaStream();
      getTracks(audioStream, 'audio').forEach(track => {
        finalStream.addTrack(track);
      });
      getTracks(canvasStream, 'video').forEach(track => {
        finalStream.addTrack(track);
      });

      const newRecorder = RecordRTC(finalStream, {
        type: 'video',
      });
      setRecorder(newRecorder);
      newRecorder.startRecording();
    });
  };

  const onClickEnd = () => {
    recorder.stopRecording(() => {
      const blob = recorder.getBlob();
      setBlob(URL.createObjectURL(blob));
      console.log(URL.createObjectURL(blob));
      console.log(blob);
      _audioStream.stop();
      _canvasStream.stop();
    });
  };

  const onChangeFile = e => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      console.log(reader);
      setImage({ file, base64: reader.result });
    };
  };

  const onClickAddPage = () => {
    const currentStreamArray = fromJS(pageList);
    const newStream = {
      id: pageList[pageList.length - 1].id + 1,
      color: 'yellow',
      point: { last: [], current: [] },
    };
    const newArray = [...currentStreamArray.toJS(), newStream];
    setPageList(newArray);
  };

  const onClickPage = page => {
    setSelectedStream(page);
  };

  const onDraw = point => {
    console.log(point);
    const currentPageList = fromJS(pageList);
    const transformed = currentPageList.toJS().map(x => {
      if (selectedStream.id === x.id) {
        return { ...x, point };
      }
      return { ...x };
    });
    console.log(transformed);
    setPageList(transformed);
  };

  // const onLeaveMouse = list => {
  //   const currentPageList = fromJS(pageList);
  //   const transformed = currentPageList.toJS().map(x => {
  //     if (selectedStream.id === x.id) {
  //       return { ...x, point: list };
  //     }
  //     return { ...x };
  //   });
  //   setPageList(transformed);
  // };

  return (
    <Wrapper>
      <LeftWrapper>
        <input type="file" name="file" onChange={onChangeFile} />
        <button onClick={onClickAddPage}>페이지 추가</button>
        <button onClick={onClickStart}>start</button>
        <button onClick={onClickEnd}>end</button>
        <PaginationWrapper>
          {pageList.map(x => (
            <div
              onClick={() => onClickPage(x)}
              style={{
                width: 100,
                height: 100,
                backgroundColor: x.color,
              }}
            />
          ))}
        </PaginationWrapper>
      </LeftWrapper>
      <RightWrapper>
        <CanvasWrapper ref={canvasWrapperRef}>
          {/* <RainbowCanvas /> */}
          <CustomCanvas
            canvasWrapperRef={canvasWrapperRef}
            canvasRef={canvasEl}
            selectedStream={selectedStream}
            image={_image}
            pageList={pageList}
            // onLeaveMouse={onLeaveMouse}
            onDraw={onDraw}
          />
        </CanvasWrapper>
        {/* <PanWrapper>
          <Video controls src={_blob} autoPlay loop />
        </PanWrapper> */}
      </RightWrapper>
    </Wrapper>
  );
}
