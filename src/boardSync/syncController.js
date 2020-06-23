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
    notifier(serverConnectionsActions.connectionReady());
    processing = false;
  }
};

const sendAction = () => {
  const nextAction = queue.getNext();

  if (nextAction) {
    try {
      serverConnector.send(nextAction);
    } catch (exception) {
      console.log(`erro em envio, aguardando ${timeWait / 1000} segundos`);
      console.log(exception);
      timeWait = timeWait + 500;
      processing = false;
      //setTimeout(sendNextAction, timeWait);
      return;
    }

    queue.commit(nextAction);
    sendAction();
  }
};

export default { newAction };
