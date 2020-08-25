import store from "../../store";
import { reducer as elementsReducer } from "../../reducers/elements";
import { boardRebuildAction } from "../../actions/serverSyncActions";

const boardStartReBuild = (data) => {
  const state = data.state;
  const actions = data.actions;

  const stateReBuilded = replayActionsInState(state, actions);

  store.dispatch(boardRebuildAction(stateReBuilded));
};

const replayActionsInState = (state, actions) => {
  let newState = state;

  if (!newState && actions.length == 0) return elementsReducer();

  for (let i = 0; i < actions.length; i++) {
    newState = elementsReducer(newState, actions[i].action);
  }

  return newState;
};

export default boardStartReBuild;
