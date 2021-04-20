import { rewindLastAction } from "../dataControllers/ActionHistoryController";
import { removeFromArray } from "../helpers/arrayManipulation";
import { DRAW } from "./../types/historyElementTypes";

export const undo = (state) => {
  let lastAction = rewindLastAction();
  if (lastAction.changes) {
    let changes = lastAction.changes;
    for (let i = 0; i < changes.length; i++) {
      applyActionBackward(state, changes[i]);
    }
    applyBoardShowBackward(state, lastAction.boardStateChanges);
  }
  return state;
};

const applyBoardShowBackward = (state, boardShow) => {
  if (boardShow) state.boardDrawShowOrder = boardShow.previous;
};

const applyActionBackward = (state, action) => {
  let elementsProperty = action.type === DRAW ? "draws" : "connectors";

  let elements = { ...state[elementsProperty] };

  updateStateBackward(state, elements, action);

  state[elementsProperty] = elements;
};

const updateStateBackward = (state, element, action) => {
  let previous = action.previous;

  //Object was created and need to be removed from boardShowOrder
  // if (Object.keys(previous).length === 1) {
  //   elements[previous.id] = undefined;
  //   let newShowOrder = removeFromArray(state.boardDrawShowOrder, previous.id);
  //   state.boardDrawShowOrder = newShowOrder;
  // } else if (!previous.parent) {
  // } else {
  element[previous.id] = previous;
  // }
};
