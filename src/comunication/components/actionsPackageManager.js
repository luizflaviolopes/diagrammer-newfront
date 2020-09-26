var actionsPackage = [];

export const addAction = (action) => {
  actionsPackage.push(action);
};

export const flushPackage = () => {
  const packageToReturn = actionsPackage;
  actionsPackage = [];
  return packageToReturn;
};
