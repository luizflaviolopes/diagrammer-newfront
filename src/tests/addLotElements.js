import store from "../store";

export const addLotElements = (count) => {
  for (let i = 0; i < count; i++) {
    let action = {
      type: "BOARD_DRAW_ADD",
      payload: {
        type: "DRAW_RECTANGLE",
        position: {
          x: i * 10,
          y: i * 10,
        },
      },
    };

    store.dispatch(action);
  }
};
