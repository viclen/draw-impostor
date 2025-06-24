import styled from "styled-components";

export const AppContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  touchaction: none;
`;

export const FabContainer = styled.div`
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 10;
`;
