import * as elementTypes from "../types/ElementTypes";

const setState = () => ({
  draws: [
    {
      id: 1,
      type: elementTypes.DRAW_RECTANGLE,
      text: "teste",
      x: 100,
      y: 500,
      heigth: 100,
      width: 100,
      connectors: [{ id: 1, type: "from" }]
    },
    {
      id: 2,
      type: elementTypes.DRAW_CIRCLE,
      text: "teste",
      x: 300,
      y: 100,
      radius: 50,
      connectors: [{ id: 1, type: "to" }]
    }
  ],
  connectors: [
    { id: 1, from: { id: 1, x: 150, y: 550 }, to: { id: 2, x: 300, y: 100 } }
  ]
});

export default (state = setState(), action = {}) => {
  return state;
};
