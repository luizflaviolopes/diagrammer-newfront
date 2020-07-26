import React from "react";
import styled from "styled-components";
import { useNavigate } from "@reach/router";
import IconButton from "./IconButton";
import { FaTrashAlt } from "react-icons/fa";

const StyledCard = styled.div`
  position: relative;
  cursor: pointer;

  :hover div.title > div {
    visibility: visible;
    animation: slideDown 0.25s ease-out;
  }
  :hover div.options {
    visibility: visible;
    animation: slideLeft 0.25s ease-out;
  }
  div.title {
    font-size: larger;
    overflow: hidden;
    text-align: center;
  }
  div.title > div {
    padding: 7px;
    visibility: hidden;
    background-color: rgb(183, 180, 77, 0.8);
    color: white;
  }
  div.options {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 35px;
    color: white;
    display: flex;
    align-items: center;
    text-align: center;
    flex-direction: row;
    visibility: hidden;

    > div {
      display: inline-block;
      background-color: black;
    }
    > buttons {
      padding-right: 10px;
    }
  }
  .flagEnd {
    height: 11px;
    width: 0;
    border-width: 23px 28px 0px 0px;
    border-style: solid;
    border-color: white black white white;
  }
`;

const DiagramCard = (props) => {
  const navigate = useNavigate();

  const handleClick = (evt) => {
    navigate(`/board/${props.boardId}`);
  };

  return (
    <StyledCard onClick={handleClick}>
      <div className="title">
        <div>{props.name}</div>
      </div>
      <div className="options">
        <div className="flagEnd"></div>
        <div className="buttons">
          <IconButton
            icon={FaTrashAlt}
            style={{ margin: "0.2em", padding: "0.2em" }}
          ></IconButton>
        </div>
      </div>
    </StyledCard>
  );
};

export default DiagramCard;
