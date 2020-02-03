import * as types from "../types/drawTypes";
import Rectangle from "../components/draws/Rectangle";
import Circle from "../components/draws/Circle";

const elementTypeResolver = type => {
  switch (type) {
    case types.DRAW_RECTANGLE:
      return Rectangle;
    case types.DRAW_CIRCLE:
      return Circle;
    default:
      return null;
  }
};

export default elementTypeResolver;
