import store from "../store";

let changedElements = {};

export const elementChange = (el) => {
  if (changedElements[el.id]) return;

  const state = store.getStore();
  const oldDraw = state.elemets.draws[el.id];

  changedElements[el.id] = Object.assign({}, oldDraw);
};

export const getAllChanges = () => {
  const state = store.getStore();

  let changedItens = Object.keys(changedElements).map((prop) => {
    return {
      previous: changedElements[prop],
      actual: state.elemets.draws[changedElements[prop].id],
    };
  });

  return changedItens;
};
