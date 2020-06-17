import queue from "./queue";
import actionConnector from "./actionConnector";

let processing = false;
let timeWait = 100;

const newAction = (action) => {
  queue.add(action);
  sendNextAction();
};

const sendNextAction = () => {
  if (!processing) {
    processing = true;
    const nextAction = queue.getNext();

    if (nextAction) {
      try {
        actionConnector.send(nextAction);
        //chama metodo de envio
      } catch (exception) {
        console.log(`erro em envio, aguardando ${timeWait / 1000} segundos`);
        console.log(exception);
        timeWait = timeWait + 500;
        processing = false;
        setTimeout(sendNextAction, timeWait);
        return;
      }

      queue.commit(nextAction);
      processing = false;
    }
  }
};

export default { newAction };
