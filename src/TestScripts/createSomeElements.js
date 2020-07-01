import store from "../store";

const bindFunction = () => {
  window.testCreateSomeElements = createSomeElements;
  window.changeCircleRadius = changeCircleRadius;
  window.repositionDraw = repositionDraw;
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

const changeCircleRadius = (el, x, y) => {
  const update = {
    type: "CHANGE_CIRCLE_RADIUS",
    payload: {
      el,
      x,
      y,
    },
  };

  store.dispatch(update);
};

const repositionDraw = (el, x, y) => {
  const update = {
    type: "TEST_REPOSITION_DRAW",
    payload: {
      el,
      x,
      y,
    },
  };

  store.dispatch(update);
};

export default bindFunction;
