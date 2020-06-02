import store from "../store";

const bindFunction = () => {
  window.testCreateSomeElements = createSomeElements;
};

const createSomeElements = (num) => {
  for (let i = 0; i < num; i++) {
    const element = {
      type: "BOARD_DRAW_ADD",
      payload: {
        type: "DRAW_RECTANGLE",
        position: {
          x: 10 * i,
          y: 10 * i,
        },
      },
    };

    store.dispatch(element);
  }
};

export default bindFunction;
