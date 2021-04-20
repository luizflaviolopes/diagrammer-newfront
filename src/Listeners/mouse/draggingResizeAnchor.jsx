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
    const drawId = evt.target.getAttribute("drawid");
    const corner = evt.target.getAttribute("corners");

  store.dispatch(
    startResizeDraw({
      id: drawId,
      mousePosition: { x: evt.clientX, y: evt.clientY },
    })
  );

  return {
    dragging: (evt) => {
      store.dispatch(
        resizeDraw({
          id: drawId,
          mousePosition: { x: evt.clientX, y: evt.clientY },
          corner,
        })
      );
    },

    drop:(evt) => {    
      store.dispatch(
        stopResizeDraw({
          id: drawId,
          mousePosition: { x: evt.clientX, y: evt.clientY },
          corner,
        })
      );
    }
  }


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
