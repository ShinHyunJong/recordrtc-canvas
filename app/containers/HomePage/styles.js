import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

export const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const LogoWrapper = styled.div`
  width: 100%;
  height: 100px;
  background-color: #6869e3;
`;

export const PaginationWrapper = styled.div`
  flex: 5;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  background-color: #4a4ab1;
  width: 100%;
  overflow-y: auto;
  display: inline-flex;
  width: 100%;
  height: calc(100% - 100px);
`;

export const PageThumb = styled.div`
  width: 150px;
  height: 100px;
  flex: 0 0 auto;
  border: 3px ${props => (props.selected ? 'pink' : 'black')} solid;
  margin-bottom: 15px;
  background-color: ${props => props.color};
  box-sizing: border-box;
`;

export const CanvasWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 3;
  width: 100%;
  height: 100%;
  background-color: wheat;
`;
export const PanWrapper = styled.div`
  flex: 1;
  height: 100%;
  border: 2px solid red;
  overflow-y: auto;
`;

export const RightWrapper = styled.div`
  flex: 5;
`;
