import store from "../../store";
import { resizeDraw, startResizeDraw } from "../../actions/drawing";

export const IsResizeAnchor = (element) => {
  //console.log(element);
  if (element.getAttribute("type") == "resizeAnchor") return true;
  else return false;
};

export const onManualResizeStart = (evt) => {
  //console.log(evt);
  window.dragging = {
    onMove: onResizeMove,
    onDrop: onResizeDrop,
    drawId: evt.target.getAttribute("drawId"),
    corner: evt.target.getAttribute("corners"),
    startPosition: { x: evt.clientX, y: evt.clientY },
  };
  store.dispatch(startResizeDraw({ id: window.dragging.drawId }));
};

const onResizeMove = (evt) => {
  let x = evt.clientX - window.dragging.startPosition.x;
  let y = evt.clientY - window.dragging.startPosition.y;
  let id = window.dragging.drawId;
  let corner = window.dragging.corner;
  store.dispatch(resizeDraw({ id: id, position: { x: x, y: y }, corner }));
};

const onResizeDrop = (evt) => {
  if (window.dragging) {
    window.dragging = undefined;
  }
};
