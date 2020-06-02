import React from "react";
import styled from "styled-components";

const SlotStyled = styled.div`
  border: solid 1px rgb(209, 209, 209);
  flex-grow: 1;
  flex-shrink: 1;
  margin: 6px;
  border-radius: 5px;
  display: flex;
  height: 30%;
  width: 30%;
  > * {
    flex-grow: 1;
    flex-basis: 30%;
  }
`;

const Slot = (props) => {
  return <SlotStyled>{props.children}</SlotStyled>;
};

export default Slot;
