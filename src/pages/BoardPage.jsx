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
import ToolBox from "../containers/ToolBox";

const BoardWrapper = (props) => {
  return (
    <div className="full-vh">
      <Board></Board>
      <DrawListTab></DrawListTab>
      <ToolBox></ToolBox>
      <ServerStatus></ServerStatus>
    </div>
  );
};

const BoardAdapter = (props) => {
  useEffect(() => {
    // boardSyncController.startBoard(props.boardId).then(() => {
    //   setStatus(true);
    // });
    setStatus(true);
    testCreateSomeElements();
    return boardSyncController.stopConnection;
  }, []);

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
