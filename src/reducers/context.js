import * as actionTypes from "../types/actionTypes";
import * as boardViewResolver from "../resolvers/boardViewResolver";
import { getPositionBoardRelative } from "../helpers/getPositionBoardRelative";

const setState = () => ({});

export default (state = setState(), action = {}) => {
  switch (action.type) {
    default:
      return state;
  }
};
