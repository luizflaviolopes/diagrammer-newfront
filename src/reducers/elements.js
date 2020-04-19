import * as elementTypes from "../types/drawTypes";
import * as actionTypes from "../types/actionTypes";
import * as drawResolver from "../resolvers/drawResolver";
import * as connectorResolvers from "../resolvers/connectorsResolver";
import * as keyboardResolver from "../resolvers/keyboardResolver";

const setState = () => ({
  boardView: {
    x: 100,
    y: 50,
    zoom: 0,
  },
  counters: {
    draws: 1,
    connectors: 1,
  },
  draws: {},
  connectors: {},
  boardDrawZOrder: [],
  boardDrawSelected: [],
  boardDrawShowOrder: [],
  sessionState: {
    drawsSelected: [],
    connectorsSelected: [],
    draggingElement: false,
    connectorDrawing: false,
    elementDragStart: null,
  },
});

export default (state = setState(), action = {}) => {
  switch (action.type) {
    case actionTypes.BOARD_SELECT_DRAW:
      return drawResolver.selectDraw({ ...state }, action.payload);
    case actionTypes.BOARD_DRAGGING_ELEMENTS:
      return drawResolver.drawDragging({ ...state }, action.payload);
    case actionTypes.BOARD_DROP_ELEMENTS:
      return drawResolver.drawdrop({ ...state }, action.payload);
    case actionTypes.BOARD_DRAW_ADD:
      return drawResolver.drawAdd({ ...state }, action.payload);
    case actionTypes.BOARD_SELECTION_CLEAR:
      return drawResolver.clearAllSelections({ ...state }, action.payload);
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
    case actionTypes.BOARD_SELECT_CONNECTOR:
      return connectorResolvers.selectConector({ ...state }, action.payload);
    case actionTypes.BOARD_DELETE_PRESSED:
      return keyboardResolver.deleteSelecteds({ ...state }, action.payload);
    default:
      return state;
  }
};
