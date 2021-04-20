const pastActions = [];
const rewindedActions = [];

window.test = { pastActions, rewindedActions };

const newAction = (actionPackage) => {
  console.log("action package", actionPackage);
  rewindedActions.length = 0;
  if (actionPackage.changes.length) {
    pastActions.push(actionPackage);
  }
};

export const rewindLastAction = () => {
  const lastAction = pastActions.pop();
  rewindedActions.push(lastAction);

  return { ...lastAction };
};

export const undoRewind = () => {
  const lastRewinded = rewindedActions.pop();
  pastActions.push(lastRewinded);

  return { ...lastRewinded };
};

export default newAction;
