import store from "../../store";
import elementsReducer from "../../reducers/elements";
import { boardRebuildAction } from "../../actions/serverSyncActions";

const boardStartReBuild = (data) => {
  const state = data.state;
  const actions = data.actions;

  const stateReBuilded = replayActionsInState(state, actions);

  store.dispatch(boardRebuildAction(stateReBuilded));
};

const replayActionsInState = (state, actionsPackages) => {
  let newState = state;

  if (!newState && actionsPackages.length == 0) return elementsReducer();

  for (let i = 0; i < actionsPackages.length; i++) {
    for (let a = 0; a < actionsPackages[i].action.length; a++) {
      newState = elementsReducer(newState, actionsPackages[i].action[a]);
    }
  }

  return newState;
};

export default boardStartReBuild;
