import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 10px red solid;
`;

export const StyledCanvas = styled.canvas`
  /* width: 100%;
  height: 100%; */

  /* cursor: url('https://supaja-v3-crm.s3.ap-northeast-2.amazonaws.com/pen.png'),
    auto; */
`;

export const ControlWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 200px;
  height: 70px;
  background-color: gray;
`;
