import { clearDrawSelected } from "./drawResolver";

export const connectorDrawingStart = (state, actionPayload) => {
  const conId = state.counters.connectors;

  let from = actionPayload.connStartFrom;

  state.connectors = {
    ...state.connectors,
    [conId]: {
      id: conId,
      endPoints: [from, { ...from, id: undefined }],
      drawing: true,
    },
  };

  return state;
};

export const connectorDrawing = (state, actionPayload) => {
  const connector = state.connectors[state.counters.connectors];
  let newEndpoint = [...connector.endPoints];

  const positionBoardRelative = actionPayload.positionRelative;

  newEndpoint[1] = {
    ...positionBoardRelative,
  };

  connector.endPoints = newEndpoint;

  return state;
};

export const connectorDrawingEnd = (state, actionPayload) => {
  if (actionPayload) {
    const drawB = state.draws[actionPayload.id];
    const connCounter = state.counters.connectors;

    const endEndPoint = actionPayload.connEndTo;
    const startEndPoint = actionPayload.connStartFrom;

    const drawA = state.draws[startEndPoint.id];
    drawA.connectors = [
      ...drawA.connectors,
      {
        id: connCounter,
        endPoint: 0,
        angle: startEndPoint.angle,
      },
    ];

    drawB.connectors = [
      ...drawB.connectors,
      {
        id: connCounter,
        endPoint: 1,
        angle: endEndPoint.angle,
      },
    ];

    let connEndpoints = [startEndPoint, endEndPoint];

    const connObject = {
      id: state.counters.connectors,
      endPoints: connEndpoints,
    };

    state.connectors[state.counters.connectors] = connObject;

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

  return state;
};

export const selectConector = (state, actionPayload) => {
  clearDrawSelected(state, actionPayload);

  if (!actionPayload.shiftPressed) {
    clearConnectorSelection(state);
  }

  const selectedConnectors = state.sessionState.connectorsSelected;

  state.sessionState.connectorsSelected = [
    ...selectedConnectors,
    actionPayload.id,
  ];
  state.connectors[actionPayload.id].selected = true;

  return state;
};

export const clearConnectorSelection = (state) => {
  for (let i = 0; i < state.sessionState.connectorsSelected.length; i++) {
    const connector =
      state.connectors[state.sessionState.connectorsSelected[i]];
    state.connectors[state.sessionState.connectorsSelected[i]] = {
      ...connector,
      selected: false,
    };
  }

  state.sessionState.connectorsSelected = [];
};
