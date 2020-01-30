import * as elementTypes from "../types/ElementTypes";
import * as actionTypes from "../types/actionTypes";
import * as elementResolvers from "../resolvers/elementsResolver";

const setState = () => ({
  counters: { draws: 3, connectors: 2 },
  draws: {
    1: {
      type: elementTypes.DRAW_RECTANGLE,
      text: "teste",
      x: 100,
      y: 500,
      heigth: 100,
      width: 100,
      connectors: [1]
    },
    2: {
      type: elementTypes.DRAW_CIRCLE,
      text: "teste",
      x: 300,
      y: 100,
      radius: 50,
      connectors: [1]
    }
  },
  connectors: {
    1: {
      1: { x: 150, y: 550 },
      2: { x: 300, y: 100 }
    }
  }
});

export default (state = setState(), action = {}) => {
  switch (action.type) {
    case actionTypes.BOARD_ELEMENT_DRAGGING:
      return elementResolvers.elementDragging({ ...state }, action.payload);
      break;
    case actionTypes.BOARD_ELEMENT_ADD:
      return elementResolvers.elementAdd({ ...state }, action.payload);
    default:
      return state;
  }
};
