import styled from 'styled-components';

export const ControllerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: ${props => (props.display === 'true' ? '0px' : '10px')};
  right: 2%;
  width: 25vw;
  height: ${props => (props.display === 'true' ? '35px' : '30vh')};
  background-color: white;
  box-shadow: 0px 4px 8px 5px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  transition: 0.2s ease-in-out all;
`;
export const ControllerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  height: 35px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: brown;
  cursor: pointer;
  &:hover {
    background-color: black;
    transition: 0.3s ease all;
  }
`;

ControllerHeader.Title = styled.div`
  color: white;
  font-size: 14px;
  color: white !important;
`;

export const ControllerBody = styled.div`
  display: flex;
  flex-direction: column;
  display: flex;
  width: 100%;
  height: calc(100% - 35px);
`;
