import * as elementTypes from "../types/drawTypes";
import * as actionTypes from "../types/actionTypes";
import * as drawResolver from "../resolvers/drawResolver";
import * as connectorResolvers from "../resolvers/connectorsResolver";
import * as keyboardResolver from "../resolvers/keyboardResolver";
import * as drawListBoxResolver from "../resolvers/drawListBoxResolver";
import { setStartDrag } from "../data/offContext";

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

export default (state, action) => {
  // if (action.payload) action.payload.inContext = true;

  return reducer(state, action);
};

export const reducer = (state = setState(), action = {}) => {
  switch (action.type) {
    //draw actions

    case actionTypes.BOARD_SELECT_DRAW:
      setStartDrag(action.payload.clientRectPositionRelative);
      return drawResolver.selectDraw({ ...state }, action.payload);
    case actionTypes.BOARD_DRAGGING_ELEMENTS:
      return drawResolver.drawDragging({ ...state }, action.payload);
    case actionTypes.BOARD_DROP_ELEMENTS:
      return drawResolver.drawdrop({ ...state }, action.payload);
    case actionTypes.BOARD_DRAW_ADD:
      return drawResolver.drawAdd({ ...state }, action.payload);
    case actionTypes.BOARD_SELECTION_CLEAR:
      return drawResolver.clearAllSelections({ ...state }, action.payload);
    case actionTypes.BOARD_DRAW_START_RESIZE:
      setStartDrag();
      return drawResolver.startResizeDraw({ ...state }, action.payload);
    case actionTypes.BOARD_DRAW_RESIZE:
      return drawResolver.resizeDraw({ ...state }, action.payload);
    case actionTypes.BOARD_DRAW_STOP_RESIZE:
      return drawResolver.endResize({ ...state }, action.payload);
    case actionTypes.BOARD_DRAW_CHANGE_TEXT:
      return drawResolver.changeText({ ...state }, action.payload);

    //ServerSyncActions
    case actionTypes.BOARD_REBUILD:
      return action.payload;

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

    //Dev (test) actions

    case "CHANGE_CIRCLE_RADIUS":
      let newstateChangeCircle = { ...state };
      let element = { ...newstateChangeCircle.draws[action.payload.el] };
      const center = {
        x: element.x + element.width / 2,
        y: element.y + element.height / 2,
      };
      element.width = action.payload.x * 2;
      element.height = action.payload.y * 2;

      element.x = center.x - element.width / 2;
      element.y = center.y - element.height / 2;
      newstateChangeCircle.draws[action.payload.el] = element;
      return newstateChangeCircle;

    case "TEST_REPOSITION_DRAW":
      let newstateChangereposition = { ...state };
      let elementToReposition = {
        ...newstateChangereposition.draws[action.payload.el],
      };

      elementToReposition.x = action.payload.x;
      elementToReposition.y = action.payload.y;
      newstateChangereposition.draws[action.payload.el] = elementToReposition;
      return newstateChangereposition;

    case "teste":
      const newstate = { ...state };
      for (let i = 0; i < newstate.boardDrawZOrder.length; i++) {
        const drawId = newstate.boardDrawZOrder[i];
        const draw = newstate.draws[drawId];

        draw.x += 20;
        draw.y += 20;
      }
      return newstate;

    default:
      return state;
  }
};
