import React from "react";
import styled from "styled-components";

const SlotStyled = styled.div`
  border: solid 1px black;
  flex-grow: 1;
  flex-basis: 30%;
  margin: 6px;
  border-radius: 5px;
  display: flex;
  > * {
    flex-grow: 1;
    flex-basis: 30%;
  }
`;

const Slot = (props) => {
  return <SlotStyled>{props.children}</SlotStyled>;
};

export default Slot;
