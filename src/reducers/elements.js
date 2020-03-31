import * as elementTypes from "../types/drawTypes";
import * as actionTypes from "../types/actionTypes";
import * as drawResolver from "../resolvers/drawResolver";
import * as connectorResolvers from "../resolvers/connectorsResolver";

const setState = () => ({
  counters: {
    draws: 3,
    connectors: 2
  },
  draws: {
    "1": {
      type: "DRAW_RECTANGLE",
      text: "",
      x: 200,
      y: 500,
      heigth: 100,
      width: 100,
      id: "1",
      connectors: {},
      childrens: []
    },
    "2": {
      type: "DRAW_CIRCLE",
      text: "",
      x: 804,
      y: 76,
      heigth: 325,
      width: 293,
      id: "2",
      connectors: {},
      childrens: [],
      selected: false,
      lastPosition: {
        x: 804,
        y: 76
      }
    }
  },
  connectors: {},
  boardDrawZOrder: [1, 2],
  boardDrawSelected: [],
  boardDrawShowOrder: [1, 2],
  sessionState: {
    elementsSelected: [],
    connectorSelected: [],
    draggingElement: false,
    connectorDrawing: false,
    elementDragStart: null
  }
});

export default (state = setState(), action = {}) => {
  switch (action.type) {
    case actionTypes.BOARD_MOUSEDOWN_DRAW:
      return drawResolver.drawMouseDown({ ...state }, action.payload);
    case actionTypes.BOARD_DRAGGING_ELEMENTS:
      return drawResolver.drawDragging({ ...state }, action.payload);
    case actionTypes.BOARD_DROP_ELEMENTS:
      return drawResolver.drawdrop({ ...state }, action.payload);
    case actionTypes.BOARD_DRAW_ADD:
      return drawResolver.drawAdd({ ...state }, action.payload);
    case actionTypes.BOARD_SELECTION_CLEAR:
      return drawResolver.selectionClear({ ...state }, action.payload);
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
      return connectorResolvers.selectConector({ ...state }, action.payload);
    case "teste":
      const newstate = { ...state };
      newstate.draws["1"].heigth = 500;
      return newstate;
      break;
    default:
      return state;
  }
};
