import { onDrawDragStart, IsDraw } from "./draggingDraw";
import { IsConnector, onDrawConnectorStart } from "./draggingConnector";
import { IsResizeAnchor, onManualResizeStart } from "./draggingResizeAnchor";
import { changeZoom } from "./zoom";

const onMouseDownFunction = (evt) => {
  if (evt.button == 0) {
    if (IsDraw(evt.target)) {
      const callbacks = onDrawDragStart(evt);
      bindCallbacks(callbacks);
    } else if (IsConnector(evt.target)) {
      const callbacks = onDrawConnectorStart(evt);
      bindCallbacks(callbacks);
    } else if (IsResizeAnchor(evt.target)) {
      const callbacks = onManualResizeStart(evt);
      bindCallbacks(callbacks);
    }
  }
};

const bindCallbacks = (callbacks) => {
  bindMouseMove(callbacks.dragging)
  bindMouseUp(callbacks.drop)
}

const bindMouseUp = (callback) => {
  window.onmouseup = (evt) => {
    callback(evt);
    unloadBinds();
  };
};

const bindMouseMove = (callback) => {
  window.onmousemove = callback;
};

const onMouseWheelFunction = (evt) => {
  changeZoom(evt);
};

const unloadBinds = () =>{
  window.onmouseup = undefined;
  window.onmousemove = undefined
}

const mouseAPI = {
  startAPI: () => {
    window.onmousedown = onMouseDownFunction;
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
