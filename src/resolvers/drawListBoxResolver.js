import * as drawResolver from "./drawResolver";

export const changeDrawListBoxSelection = (state, payload) => {
  state.drawListBoxSelection = payload.selected;
  return state;
};

export const startDragDrawListBoxDraw = (state, payload) => {
  const lastCounter = state.counters.draws;

  let newstate = drawResolver.drawAdd(state, payload);

  const actualCounter = state.counters.draws;

  if (lastCounter + 1 !== actualCounter)
    throw "Ocorreu um erro na inclusão do elemento";

  newstate = drawResolver.selectDraw(newstate, {
    id: lastCounter,
    clientRectPosition: payload.position,
    shiftPressed: false,
  });

  return newstate;
};
