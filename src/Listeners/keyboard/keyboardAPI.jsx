import store from "../../store";
import { deletePressed } from "../../actions/keyboardActions.js";

const keyboardAPI = {
  start: () => {
    window.onkeydown = keyPressed;
  },
  stop: () => {
    window.onkeydown = undefined;
  },
};

const keyPressed = (evt) => {
  switch (evt.key) {
    case "Backspace":
    case "Delete":
      store.dispatch(deletePressed());
      break;
  }
};

export default keyboardAPI;
