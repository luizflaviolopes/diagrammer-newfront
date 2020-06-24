import queue from "./queue";
import serverConnector from "./serverConnector";
import notifier from "./connectionEventsNotifier";
import * as serverConnectionsActions from "../actions/serverConnectionActions";

let processing = false;
let timeWait = 100;

const newAction = (action) => {
  queue.add(action);
  processActions();
};

const processActions = () => {
  if (!processing) {
    processing = true;
    notifier(serverConnectionsActions.connectionBusy());
    sendAction();
  }
};

const sendAction = async () => {
  const nextAction = queue.getNext();

  if (nextAction) {
    try {
      console.time("send");
      serverConnector.send(nextAction);
      console.timeEnd("send");
    } catch (exception) {
      //console.log(`erro em envio, aguardando ${timeWait / 1000} segundos`);
      //console.log(exception);
      timeWait = timeWait + 500;
      setTimeout(sendAction, timeWait);
      //throw exception;
    }

    queue.commit(nextAction);
    sendAction();
  } else {
    notifier(serverConnectionsActions.connectionReady());
    processing = false;
    return;
  }
};

export default { newAction };
