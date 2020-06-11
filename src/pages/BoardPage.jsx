import React from "react";
import Board from "../containers/Board";
import DrawListTab from "../components/DrawListTab";
import { Provider } from "react-redux";
import store from "../store";

const BoardPage = (props) => {
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
