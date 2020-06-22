import React from "react";
import Board from "../containers/Board";
import DrawListTab from "../components/DrawListTab";
import testCreateSomeElements from "../TestScripts/createSomeElements";
import { Provider } from "react-redux";
import store from "../store";

const BoardPage = (props) => {
  testCreateSomeElements();

  return (
    <Provider store={store}>
      <div class="full-vh">
        <Board></Board>
        <DrawListTab></DrawListTab>
      </div>
    </Provider>
  );
};

export default BoardPage;
