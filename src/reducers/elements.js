import * as elementTypes from "../types/drawTypes";
import * as actionTypes from "../types/actionTypes";
import * as drawResolver from "../resolvers/drawResolver";
import * as connectorResolvers from "../resolvers/connectorsResolver";

const setState = () => ({
  counters: { draws: 3, connectors: 1 },
  draws: {
    1: {
      type: elementTypes.DRAW_RECTANGLE,
      text: "",
      x: 200,
      y: 500,
      heigth: 100,
      width: 100,
      id: "1",
      connectors: [],
      parent: undefined,
      childrens: [],
      absolutePosition: { x: 200, y: 500 }
    },
    2: {
      type: elementTypes.DRAW_CIRCLE,
      text: "",
      x: 300,
      y: 100,
      radius: 50,
      id: "2",
      connectors: [],
      parent: undefined,
      childrens: [],
      absolutePosition: { x: 300, y: 100 }
    }
  },
  connectors: {},
  boardDrawZOrder: ["1", "2"],
  boardDrawSelected: [],
  boardDrawShowOrder: ["1", "2"],

  sessionState: {
    elementsSelected: []
  }
});

export default (state = setState(), action = {}) => {
  switch (action.type) {
    case actionTypes.BOARD_MOUSEDOWN_DRAW:
      return drawResolver.drawMouseDown({ ...state }, action.payload);
    case actionTypes.BOARD_DRAGGING_ELEMENTS:
      return drawResolver.drawDragging({ ...state }, action.payload);
    // case actionTypes.BOARD_CLEAR_HIGHLIGHT_DRAW_DRAGGING:
    //   return drawResolver.clearHighLightDrawDragging(
    //     { ...state },
    //     action.payload
    //   );
    case actionTypes.BOARD_DROP_ELEMENTS:
      return drawResolver.drawdrop({ ...state }, action.payload);
    case actionTypes.BOARD_DRAW_ADD:
      return drawResolver.drawAdd({ ...state }, action.payload);
    // case actionTypes.BOARD_SELECT_DRAW:
    //   return drawResolver.drawSelect({ ...state }, action.payload);
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

    default:
      return state;
  }
};
