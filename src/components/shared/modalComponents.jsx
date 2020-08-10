import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const Structure = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  font-family: Roboto;
`;
const Background = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: gray;
  opacity: 0.5;
  z-index: -1;
`;
const ContentContainer = styled.div`
  min-height: 5rem;
  min-width: 5rem;
  background-color: white;
  min-height: 5rem;
  min-width: 5rem;
  background-color: white;
  position: absolute;
  padding: 1rem;
  border-radius: 0.5rem;
  top: 13rem;
  left: 50%;
  transform: translateX(-50%);
`;

export default ({ children, closeAction }) => {
  const modal = (
    <Structure>
      <Background
        onClick={() => {
          closeAction();
        }}
      />
      <ContentContainer>{children}</ContentContainer>
    </Structure>
  );

  return ReactDOM.createPortal(modal, document.getElementById("root"));
};

export const Header = styled.div`
  text-align: center;
  font-size: x-large;
  font-weight: 800;
  border-bottom: solid 1px rgb(183, 180, 77);
  padding-bottom: 0.7rem;
`;
export const Footer = styled.div``;
