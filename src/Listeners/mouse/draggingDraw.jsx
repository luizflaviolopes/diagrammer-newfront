import store from "../../store";
import { mouseDown, dragging, drop } from "../../actions/drawing";

export const IsDraw = (element) => {
  if (element.getAttribute("draw")) return true;
  else return false;
};

export const onDrawDragStart = (evt) => {
  window.dragging = {
    mousePressedObject: evt.target,
    objectId: evt.target.id,
    onMove: onDrawDragging,
    onDrop: onDrawDrop,
  };
  store.dispatch(
    mouseDown({
      id: evt.target.id,
      shiftPressed: evt.shiftKey,
      clientRectPosition: evt.target.getBoundingClientRect(),
      mousePosition: { x: evt.clientX, y: evt.clientY },
    })
  );
};

export const onDrawDragging = (evt) => {
  let id = window.dragging.objectId;
  store.dispatch(
    dragging({ id: id, mousePosition: { x: evt.clientX, y: evt.clientY } })
  );
};

export const onDrawDrop = (evt) => {
  console.log(evt);

  if (IsDraw(evt.toElement)) {
    let evtMeasures = evt.toElement.getBoundingClientRect();
    store.dispatch(
      drop({
        id: evt.toElement.id,
        mousePosition: { x: evtMeasures.x, y: evtMeasures.y },
      })
    );
  } else store.dispatch(drop({}));

  window.dragging = undefined;
};
