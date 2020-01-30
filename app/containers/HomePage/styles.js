import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

export const LeftWrapper = styled.div`
  flex: 1;
`;

export const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  background-color: ghostwhite;
  width: 100%;
  height: 100%;
`;

export const PageThumb = styled.div`
  width: 150px;
  height: 100px;
  border: 3px ${props => (props.selected ? 'pink' : 'black')} solid;
  margin-bottom: 15px;
  background-color: ${props => props.color};
`;

export const CanvasWrapper = styled.div`
  /* display: flex;
  justify-content: center; */
  border: 1px red solid;
  flex: 3;
  width: 100%;
  height: 000px;
`;
export const PanWrapper = styled.div`
  flex: 1;
  height: 100%;
  border: 2px solid red;
  overflow-y: auto;
`;

export const RightWrapper = styled.div`
  flex: 4;
  border: 4px khaki solid;
  display: flex;
  flex-direction: column;
`;
