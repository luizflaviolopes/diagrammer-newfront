import { removeFromArray } from "../helpers/arrayManipulation";
import { connect } from "react-redux";

export const deleteSelecteds = (state) => {
  const selectedObjects = {
    connectors: state.sessionState.connectorsSelected,
    draws: state.sessionState.drawsSelected,
  };

  for (let i = 0; i < selectedObjects.connectors.length; i++) {
    const connectorId = selectedObjects.connectors[i];
    const connector = state.connectors[connectorId];

    deleteConnector(state, connector);
  }

  state.sessionState.connectorsSelected = [];

  return state;
};

const deleteDraw = (state, draw) => {
  //------------------------------------------------------------------------implementar
};

const deleteConnector = (state, connector) => {
  //remover as referencias nos draws

  const fromDrawId = connector.endPoints[0].id;
  const toDrawId = connector.endPoints[1].id;

  const fromDraw = state.draws[fromDrawId];
  const toDraw = state.draws[toDrawId];

  console.log("deletando...", fromDraw);

  if (fromDraw != undefined) {
    fromDraw.connectors = removeFromArray(fromDraw.connectors, (obj) => {
      return obj.id == connector.id;
    });
  }
  if (toDraw != undefined) {
    toDraw.connectors = removeFromArray(toDraw.connectors, (obj) => {
      return obj.id == connector.id;
    });
  }

  //remover de connectors
  const connectors = { ...state.connectors };
  delete connectors[connector.id];
  state.connectors = connectors;
};
