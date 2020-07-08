import React, { useEffect } from "react";
import Board from "../containers/Board";
import DrawListTab from "../components/DrawListTab";
import BoardLoader from "../components/BoardLoader";
import testCreateSomeElements from "../TestScripts/createSomeElements";
import { Provider } from "react-redux";
import store from "../store";
import ServerStatus from "../containers/ServerStatus";
import boardSyncController from "../comunication/boardSyncController";
import { useState } from "react";

const BoardWrapper = (props) => {
  return (
    <div class="full-vh">
      <Board></Board>
      <DrawListTab></DrawListTab>
      <ServerStatus></ServerStatus>
    </div>
  );
};

const BoardAdapter = (props) => {
  useEffect(() => {
    syncController.startConnection();
    testCreateSomeElements();
    return syncController.stopConnection;
  });

  const [status, setStatus] = useState(false);

  if (status) return <BoardWrapper></BoardWrapper>;
  else return <BoardLoader></BoardLoader>;
};

const BoardPage = (props) => {
  return (
    <Provider store={store}>
      <BoardAdapter boardId={props.boardId}></BoardAdapter>
    </Provider>
  );
};

export default BoardPage;
