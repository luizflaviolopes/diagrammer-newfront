import { pack } from "d3";
import * as types from "../../types/actionTypes";

export const shrinkDropElements = (actionsPackage) => {
  const selects = actionsPackage.filter(
    (act) => act.type == types.BOARD_SELECT_DRAW
  );
  const draggings = actionsPackage.filter(
    (act) => act.type == types.BOARD_DRAGGING_ELEMENTS
  );

  if (draggings.length === 0) {
    return selects;
  }

  const drop = actionsPackage[actionsPackage.length - 1];

  const endDrag = {
    type: types.BOARD_DRAGGING_ELEMENTS,
    payload: {
      displacement: {
        x: draggings.reduce((num, item) => {
          return num + item.payload.displacement.x;
        }, 0),
        y: draggings.reduce((num, item) => {
          return num + item.payload.displacement.y;
        }, 0),
      },
      selectedDraws: drop.payload.selectedDraws,
    },
  };

  return [...selects, endDrag, drop];
};
