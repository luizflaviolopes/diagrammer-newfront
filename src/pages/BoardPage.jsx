import React from "react";
import Board from "../containers/Board";
import DrawListTab from "../components/DrawListTab";

const BoardPage = (props) => {
  return (
    <div class="full-vh">
      <Board></Board>
      <DrawListTab></DrawListTab>
    </div>
  );
};

export default BoardPage;
