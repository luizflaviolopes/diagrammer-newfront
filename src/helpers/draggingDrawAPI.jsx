import store from "../store";
import { mouseDown, dragging, drop } from "../actions/drawing";

const onMouseDownFunction = evt => {
  if (IsDraw(evt.target)) {
    window.dragging = {
      mousePressedObject: evt.target,
      objectId: evt.target.id,
      startPosition: { x: evt.clientX, y: evt.clientY },
      onMove: onDrawDragging,
      onDrop: onDrawDrop
    };
    evt.target.style.pointerEvents = "none";
    store.dispatch(
      mouseDown({
        id: evt.target.id,
        shiftPressed: evt.shiftKey
      })
    );
  }
};

const IsDraw = element => {
  if (element.getAttribute("draw")) return true;
  else return false;
};

const onMouseUpFunction = evt => {
  if (window.dragging) {
    window.dragging.onDrop(evt);
  }
};

const onMouseMoveFunction = evt => {
  if (window.dragging) {
    window.dragging.onMove(evt);
  }
};

const onDrawDragging = evt => {
  let x = evt.clientX - window.dragging.startPosition.x;
  let y = evt.clientY - window.dragging.startPosition.y;
  let id = window.dragging.objectId;
  console.log("dragging");
  store.dispatch(dragging({ id: id, position: { x: x, y: y } }));
};

const onDrawDrop = evt => {
  if (IsDraw(evt.toElement)) {
    store.dispatch(drop({ id: evt.toElement.id }));
  } else store.dispatch(drop({}));
  if (window.dragging) {
    window.dragging.mousePressedObject.style.pointerEvents = "bounding-box";
    window.dragging = undefined;
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
  }
};

export default draggingAPI;
