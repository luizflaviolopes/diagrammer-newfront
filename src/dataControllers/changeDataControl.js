import store from "../store";
import actionHistoryAdd from "./ActionHistoryController";
import boardSync from "../comunication/boardSyncController";
import { v4 as uuidv4 } from "uuid";
import { CONNECTOR, DRAW } from "./../types/historyElementTypes";
import _ from "lodash";

let changedElements = {};
let changedConnectors = {};
let startBoardShowOrder = undefined;

export const elementChange = (el) => {
  if (changedElements[el.id]) return;

  changedElements[el.id] = _.cloneDeep(el);
  console.log("changed element", el);
};

export const connectorChange = (conn) => {
  if (changedConnectors[conn.id]) return;

  changedElements[conn.id] = _.cloneDeep(conn);
};

export const startPossibleBoardShowOrderChange = (boardShowOrder) => {
  startBoardShowOrder = _.cloneDeep(boardShowOrder);
};

export const FinishAction = (action) => {
  const changesPackage = getAllChanges();
  actionHistoryAdd(changesPackage);
  boardSync.sendAction(changesPackage);
};

export const getAllChanges = () => {
  const state = store.getState();

  let changedDrawsToSend = Object.keys(changedElements).map((id) => {
    return {
      previous: changedElements[id],
      current: _.cloneDeep(state.elements.draws[changedElements[id].id]),
      type: DRAW,
    };
  });
  let changedConnectorsToSend = Object.keys(changedConnectors).map((id) => {
    return {
      previous: changedConnectors[id],
      current: _.cloneDeep(state.elements.connectors[changedElements[id].id]),
      type: CONNECTOR,
    };
  });

  const currentBoard = state.elements.boardDrawShowOrder;
  let boardStateChanges = undefined;

  if (startBoardShowOrder && startBoardShowOrder.length !== currentBoard.length)
    boardStateChanges = {
      previous: startBoardShowOrder,
      current: _.cloneDeep(currentBoard),
    };

  let id = uuidv4();
  let time = Date.now();

  let allChanges = {
    id: id,
    at: time,
    changes: changedDrawsToSend.concat(changedConnectorsToSend),
    boardStateChanges,
  };

  changedElements = {};
  changedConnectors = {};
  startBoardShowOrder = undefined;

  return allChanges;
};
