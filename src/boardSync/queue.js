let queue = [];

const addAction = (action) => {
  queue.push(action);
};

const getNextAction = () => {
  if (queue.length) return queue[0];
  else return undefined;
};

const commitActionSend = (action) => {
  if (queue[0] == action) queue.shift();
};

export default {
  add: addAction,
  getNext: getNextAction,
  commit: commitActionSend,
};
