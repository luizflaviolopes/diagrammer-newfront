import { removeFromArray } from "../helpers/arrayManipulation";

export const deleteSelecteds = (state, actionPayload) => {
  const selectedDraws = actionPayload.selectedDraws;

  const selectedConnectors = actionPayload.selectedConnectors;

  for (let i = 0; i < selectedConnectors.length; i++) {
    const connectorId = selectedConnectors[i];
    const connector = state.connectors[connectorId];

    deleteConnector(state, connector);
  }

  const selectDrawsIds = Object.keys(selectedDraws);

  for (let i = 0; i < selectDrawsIds.length; i++) {
    const drawId = selectDrawsIds[i];
    const draw = state.draws[drawId];

    deleteDraw(state, draw);
  }

  return state;
};

const deleteDraw = (state, draw) => {
  //Constante para manter a listagem original de conectores
  const drawConnectors = draw.connectors;

  for (let i = 0; i < drawConnectors.length; i++) {
    const connectorId = drawConnectors[i].id;
    const connector = state.connectors[connectorId];

    //Remove conector do state
    deleteConnector(state, connector);
  }

  if (!draw.parent) {
    state.boardDrawZOrder = removeFromArray(state.boardDrawZOrder, draw.id);
  } else {
    const parent = state.draws[draw.parent];
    parent.childrens = removeFromArray(parent.childrens, draw.id);
  }

  //Constante para manter a listagem original de filhos
  const drawChildrens = draw.childrens;

  for (let i = 0; i < drawChildrens.length; i++) {
    const childrenId = drawChildrens[i];
    const children = state.draws[childrenId];

    //Remove filho
    deleteDraw(state, children);
  }

  const draws = { ...state.draws };
  delete draws[draw.id];
  state.draws = draws;
};

const deleteConnector = (state, connector) => {
  if (connector) {
    //remover as referencias nos draws

    const fromDrawId = connector.endPoints[0].id;
    const toDrawId = connector.endPoints[1].id;

    const fromDraw = state.draws[fromDrawId];
    const toDraw = state.draws[toDrawId];

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
  }
};
