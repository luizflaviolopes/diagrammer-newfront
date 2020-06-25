import React, { useEffect } from "react";
import Board from "../containers/Board";
import DrawListTab from "../components/DrawListTab";
import { Provider } from "react-redux";
import store from "../store";
import ServerStatus from "../containers/ServerStatus";
import syncController from "../boardSync/syncController";

const BoardPage = (props) => {
  useEffect(() => {
    syncController.startConnection();
    return syncController.stopConnection;
  });

  return (
    <Provider store={store}>
      <div class="full-vh">
        <Board></Board>
        <DrawListTab></DrawListTab>
        <ServerStatus></ServerStatus>
      </div>
    </Provider>
  );
};

export default BoardPage;
