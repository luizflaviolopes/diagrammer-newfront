import notifier from "./connectionEventsNotifier";
import * as serverConnectionsActions from "../../actions/serverConnectionActions";

let queue = [];
let processing = false;

const addAction = (action) => {
  queue.push(action);
  if (!processing) notifier(serverConnectionsActions.connectionBusy());
};

const getNextAction = () => {
  if (queue.length) {
    return queue[0];
  } else {
    notifier(serverConnectionsActions.connectionReady());
    return undefined;
  }
};

const commitActionSend = (action) => {
  if (queue[0] == action) queue.shift();
};

export default {
  add: addAction,
  getNext: getNextAction,
  commit: commitActionSend,
};
