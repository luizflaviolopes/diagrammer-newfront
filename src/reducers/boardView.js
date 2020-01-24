const setState = () => ({
  viewX: 0,
  viewY: 0
});

export default (state = setState(), action = {}) => {
  return state;
};
