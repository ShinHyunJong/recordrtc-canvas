import styled from 'styled-components';

export const ControllerWrapper = styled.div`
  display: ${props => props.display};
  position: absolute;
  right: 0;
  top: 0;
  background-color: transparent;
  width: 400px;
  height: 150px;
  border-radius: 20px;
`;

export const ControllerContent = styled.div`
  background-color: whitesmoke;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.28) 0px 1px 2px 2px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 10px;
  border-radius: 0 0 5px 5px;
  position: absolute;
  left: ${props => props.left || 0};
  transition: 0.2s ease-in-out;
`;
