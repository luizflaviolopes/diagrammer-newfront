import React from "react";
import styled from "styled-components";

const IconButtonStyled = styled.div`
  font-size: ${(props) => (props.size ? props.size : "xx-large")};
  margin: 5px 5px;
  padding: 10px 15px;
  cursor: pointer;
  :hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

const IconButton = (props) => {
  return (
    <IconButtonStyled
      size={props.size}
      style={props.style}
      onClick={props.onClick}
    >
      <props.icon></props.icon>{" "}
    </IconButtonStyled>
  );
};

export default IconButton;
