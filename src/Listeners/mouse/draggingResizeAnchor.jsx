import store from "../../store";
import {
  resizeDraw,
  startResizeDraw,
  stopResizeDraw,
} from "../../actions/drawing";

export const IsResizeAnchor = (element) => {
  if (element.getAttribute("type") == "resizeAnchor") return true;
  else return false;
};

export const onManualResizeStart = (evt) => {
  window.dragging = {
    onMove: onResizeMove,
    onDrop: onResizeDrop,
    drawId: evt.target.getAttribute("drawId"),
    corner: evt.target.getAttribute("corners"),
  };
  store.dispatch(
    startResizeDraw({
      id: window.dragging.drawId,
      mousePosition: { x: evt.clientX, y: evt.clientY },
    })
  );
};

const onResizeMove = (evt) => {
  let id = window.dragging.drawId;
  let corner = window.dragging.corner;
  store.dispatch(
    resizeDraw({
      id: id,
      mousePosition: { x: evt.clientX, y: evt.clientY },
      corner,
    })
  );
};

const onResizeDrop = (evt) => {
  let id = window.dragging.drawId;
  let corner = window.dragging.corner;

  store.dispatch(
    stopResizeDraw({
      id: id,
      mousePosition: { x: evt.clientX, y: evt.clientY },
      corner,
    })
  );
  if (window.dragging) {
    window.dragging = undefined;
  }
};
