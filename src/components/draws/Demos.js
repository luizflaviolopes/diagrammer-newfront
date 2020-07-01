import React from "react";
import styled from "styled-components";

import * as drawTypes from "../../types/drawTypes";

import { Demo as dCircle } from "./Circle";
import { Demo as dRectangle } from "./Rectangle";

export default {
  Circle: { type: drawTypes.DRAW_CIRCLE, component: dCircle },
  Rectangle: { type: drawTypes.DRAW_RECTANGLE, component: dRectangle },
};
