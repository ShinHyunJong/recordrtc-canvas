/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useRef, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import messages from './messages';
import RainbowCanvas from './Canvas';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 10px blue solid;
`;

export const Video = styled.video`
  width: 1000px;
  height: 600px;
`;
export default function HomePage() {
  const { RecordRTC, getTracks } = window;
  const canvasEl = useRef(null);
  const [recorder, setRecorder] = useState(null);
  const [_audioStream, setAudioStream] = useState(null);
  const [_canvasStream, setCanvasStream] = useState(null);
  const [_blob, setBlob] = useState(null);

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
      console.log(blob);
      _audioStream.stop();
      _canvasStream.stop();
    });
  };
  return (
    <Wrapper>
      <button onClick={onClickStart}>start</button>
      <button onClick={onClickEnd}>end</button>
      <Video controls src={_blob} autoPlay loop />
      <RainbowCanvas canvasRef={canvasEl} width={1000} height={600} />
    </Wrapper>
  );
}
