import React from "react";
import styled from "styled-components";
import { FaPlusSquare } from "react-icons/fa";

const ButtonCreateStyled = styled.div`
  width: 100%;
  height: 100%;
  background-color: green;
  border: 4px solid #036203;
  font-size: xx-large;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-itens: center;
  text-align: center;
  color: white;
`;

const ButtonCreate = (props) => {
  return (
    <div>
      <ButtonCreateStyled>
        <div>
          <FaPlusSquare></FaPlusSquare>
        </div>
        Novo Diagrama
      </ButtonCreateStyled>
    </div>
  );
};

export default ButtonCreate;
