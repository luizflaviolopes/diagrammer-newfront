import { onDrawDragStart, IsDraw } from "./draggingDraw";
import { IsConnector, onDrawConnectorStart } from "./draggingConnector";
import { IsResizeAnchor, onManualResizeStart } from "./draggingResizeAnchor";
import { changeZoom } from "./zoom";

const onMouseDownFunction = (evt) => {
  if (evt.button == 0) {
    if (IsDraw(evt.target)) {
      onDrawDragStart(evt);
    } else if (IsConnector(evt.target)) {
      onDrawConnectorStart(evt);
    } else if (IsResizeAnchor(evt.target)) {
      onManualResizeStart(evt);
    }
  }
};

const onMouseUpFunction = (evt) => {
  if (window.dragging) {
    window.dragging.onDrop(evt);
  }
};

const onMouseMoveFunction = (evt) => {
  if (window.dragging) {
    window.dragging.onMove(evt);
  }
};

const onMouseWheelFunction = (evt) => {
  changeZoom(evt);
};

const mouseAPI = {
  startAPI: () => {
    window.onmousedown = onMouseDownFunction;
    window.onmouseup = onMouseUpFunction;
    window.onmousemove = onMouseMoveFunction;
    window.onmousewheel = onMouseWheelFunction;
  },
  endAPI: () => {
    window.onmousedown = undefined;
    window.onmouseup = undefined;
    window.onmousemove = undefined;
    window.onmousewheel = undefined;
  },
};

export default mouseAPI;
