import * as elementTypes from "../types/drawTypes";
import * as actionTypes from "../types/actionTypes";
import * as drawResolver from "../resolvers/drawResolver";
import * as connectorResolvers from "../resolvers/connectorsResolver";
import * as keyboardResolver from "../resolvers/keyboardResolver";
import * as drawListBoxResolver from "../resolvers/drawListBoxResolver";

const setState = () => ({
  counters: {
    draws: 1,
    connectors: 1,
  },
  drawListBoxSelection: "DRAW_RECTANGLE",
  draws: {},
  connectors: {},
  boardDrawZOrder: [],
  //acho que pode ser deletado
  boardDrawSelected: [],
  boardDrawShowOrder: [],
  sessionState: {
    drawsSelected: [],
    connectorsSelected: [],
    draggingElement: false,
    //acho que pode ser deletado
    connectorDrawing: false,
    //acho que pode ser deletado
    elementDragStart: null,
  },
});

export default (state = setState(), action = {}) => {
  switch (action.type) {
    //draw actions

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

    //connector actions

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

    //keyboard actions

    case actionTypes.BOARD_DELETE_PRESSED:
      return keyboardResolver.deleteSelecteds({ ...state }, action.payload);

    //drawListBox actions

    case actionTypes.DRAWLIST_CHANGE_SELECTED:
      return drawListBoxResolver.changeDrawListBoxSelection(
        { ...state },
        action.payload
      );
    case actionTypes.DRAWLIST_DRAG_BLOCK:
      return drawListBoxResolver.startDragDrawListBoxDraw(
        { ...state },
        action.payload
      );
    case actionTypes.DRAWLIST_DROP_BLOCK_OUT_OF_BOARD:
      return drawListBoxResolver.deleteDrawDroppedOutOfBoard(
        { ...state },
        action.payload
      );

    default:
      return state;
  }
};
