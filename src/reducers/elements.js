import * as elementTypes from "../types/ElementTypes";
import * as actionTypes from "../types/actionTypes";
import * as elementResolvers from "../resolvers/elementsResolver";
import * as connectorResolvers from "../resolvers/connectorsResolver";

const setState = () => ({
  counters: { draws: 3, connectors: 1 },
  draws: {
    1: {
      type: elementTypes.DRAW_RECTANGLE,
      text: "",
      x: 100,
      y: 500,
      heigth: 100,
      width: 100,
      connectors: []
    },
    2: {
      type: elementTypes.DRAW_CIRCLE,
      text: "",
      x: 300,
      y: 100,
      radius: 50,
      connectors: []
    }
  },
  connectors: {},
  transients: {}
});

export default (state = setState(), action = {}) => {
  switch (action.type) {
    case actionTypes.BOARD_ELEMENT_DRAGGING:
      return elementResolvers.elementDragging({ ...state }, action.payload);
    case actionTypes.BOARD_ELEMENT_ADD:
      return elementResolvers.elementAdd({ ...state }, action.payload);
    case actionTypes.BOARD_CONNECTOR_DRAWING:
      return connectorResolvers.connectorDrawing({ ...state }, action.payload);
    case actionTypes.BOARD_CONNECTOR_DRAWING_START:
      return connectorResolvers.connectorDrawingStart(
        { ...state },
        action.payload
      );
    case actionTypes.BOARD_CONNECTOR_DRAWING_END:
      return connectorResolvers.connectorDrawingEnd(
        { ...state },
        action.payload
      );

    default:
      return state;
  }
};
