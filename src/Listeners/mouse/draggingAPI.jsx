import { onDrawDragStart, IsDraw } from "./draggingDraw";
import { IsConnector, onDrawConnectorStart } from "./draggingConnector";
import { IsResizeAnchor, onManualResizeStart } from "./draggingResizeAnchor";

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

const draggingAPI = {
  startDrag: () => {
    window.onmousedown = onMouseDownFunction;
    window.onmouseup = onMouseUpFunction;
    window.onmousemove = onMouseMoveFunction;
  },
  endDrag: () => {
    window.onmousedown = undefined;
    window.onmouseup = undefined;
    window.onmousemove = undefined;
  },
};

export default draggingAPI;
