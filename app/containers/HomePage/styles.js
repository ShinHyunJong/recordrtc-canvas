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

export const PaginationWrapper = styled.div``;

export const CanvasWrapper = styled.div`
  /* display: flex;
  justify-content: center; */
  border: 1px red solid;
  flex: 3;
  width: 100%;
  overflow-y: auto;
  height: 3000px;
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
