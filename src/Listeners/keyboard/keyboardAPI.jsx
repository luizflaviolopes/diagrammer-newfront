import store from "../../store";
import { deletePressed, undo, redo } from "../../actions/keyboardActions.js";

const keyboardAPI = {
  start: () => {
    window.onkeyup = keyPressed;
  },
  stop: () => {
    window.onkeydown = undefined;
  },
};

const keyPressed = (evt) => {
  switch (evt.code) {
    case "Backspace":
    case "Delete":
      store.dispatch(deletePressed({}));
      break;
    case 'KeyZ':
      if(evt.ctrlKey)
      store.dispatch(undo({}));
      break;
      case 'KeyY':
        if(evt.ctrlKey)
        store.dispatch(redo({}));
        break;
    default:
      break;
  }
};

export default keyboardAPI;
