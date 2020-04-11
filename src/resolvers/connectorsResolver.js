import { intermediatePointsCalculator } from "../helpers/connectorPointsCalculator";
import { selectionClear } from "./drawResolver";

export const connectorDrawingStart = (state, actionPayload) => {
  state.sessionState.connectorDrawing = true;

  const conId = state.counters.connectors;
  const idFrom = +actionPayload.id;

  let from = {
    id: idFrom,
    x: actionPayload.variant.absolutePosition.x,
    y: actionPayload.variant.absolutePosition.y,
    angle: actionPayload.variant.angle
  };

  state.connectors = {
    ...state.connectors,
    [conId]: {
      endPoints: [from, { ...from, id: undefined }],
      drawing: true
    }
  };

  return state;
};

export const connectorDrawing = (state, actionPayload) => {
  console.log("connectorDragging", state.connectors, state.counters.connectors);

  const connector = state.connectors[state.counters.connectors];
  let newEndpoint = [...connector.endPoints];

  newEndpoint[1] = {
    ...actionPayload
  };

  connector.endPoints = newEndpoint;

  return state;
};

export const connectorDrawingEnd = (state, actionPayload) => {
  if (actionPayload) {
    const drawB = state.draws[actionPayload.id];
    const connCounter = state.counters.connectors;

    const connObject = state.connectors[connCounter];

    const drawA = state.draws[connObject.endPoints[0].id];
    drawA.connectors = [
      ...drawA.connectors,
      {
        id: connCounter,
        endPoint: 0,
        angle: connObject.endPoints[0].angle
      }
    ];

    drawB.connectors = [
      ...drawB.connectors,
      {
        id: connCounter,
        endPoint: 1,
        angle: actionPayload.variants.angle
      }
    ];

    let connEndpoints = [...connObject.endPoints];
    connEndpoints[1].id = +actionPayload.id;

    connObject.endPoints = connEndpoints;
    connObject.drawing = undefined;

    // connObject.intermediatePoints = intermediatePointsCalculator(
    //   connEndpoints[0],
    //   connEndpoints[1],
    //   20
    // );

    state.counters.connectors = state.counters.connectors + 1;
  } else {
    let connectors = { ...state.connectors };
    delete connectors[state.counters.connectors];
    state.connectors = connectors;
  }

  state.sessionState.connectorDrawing = false;
  state.sessionState.connectorStartElement = null;
  state.sessionState.drawingConnector = undefined;

  return state;
};

export const selectConector = (state, actionPayload) => {
  selectionClear(state, actionPayload);
  clearConnectorSelection(state);

  state.sessionState.connectorSelected = [actionPayload.id];
  state.connectors[actionPayload.id].selected = true;

  return state;
};

export const clearConnectorSelection = state => {
  for (let i = 0; i < state.sessionState.connectorSelected.length; i++) {
    const connector = state.connectors[state.sessionState.connectorSelected[i]];
    state.connectors[state.sessionState.connectorSelected[i]] = {
      ...connector,
      selected: false
    };
  }

  state.sessionState.connectorSelected = [];
};
