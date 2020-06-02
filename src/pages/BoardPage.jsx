import React from "react";
import Board from "../containers/Board";
import DrawListTab from "../components/DrawListTab";
import testCreateSomeElements from "../TestScripts/createSomeElements";

const BoardPage = (props) => {
  testCreateSomeElements();

  return (
    <div class="full-vh">
      <Board></Board>
      <DrawListTab></DrawListTab>
    </div>
  );
};

export default BoardPage;
