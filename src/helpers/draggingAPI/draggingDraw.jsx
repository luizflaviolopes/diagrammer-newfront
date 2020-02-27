import store from "../../store";
import { mouseDown, dragging, drop } from "../../actions/drawing";

export const IsDraw = element => {
  if (element.getAttribute("draw")) return true;
  else return false;
};

export const onDrawDragStart = evt => {
  window.dragging = {
    mousePressedObject: evt.target,
    objectId: evt.target.id,
    startPosition: { x: evt.clientX, y: evt.clientY },
    onMove: onDrawDragging,
    onDrop: onDrawDrop
  };
  store.dispatch(
    mouseDown({
      id: evt.target.id,
      shiftPressed: evt.shiftKey,
      clientRectPosition: evt.target.getBoundingClientRect()
    })
  );
};

export const onDrawDragging = evt => {
  let x = evt.clientX - window.dragging.startPosition.x;
  let y = evt.clientY - window.dragging.startPosition.y;
  let id = window.dragging.objectId;
  store.dispatch(dragging({ id: id, position: { x: x, y: y } }));
};

export const onDrawDrop = evt => {
  console.log(evt);
  if (window.dragging) {
    if (IsDraw(evt.toElement) && window.dragging.objectId != evt.toElement.id) {
      let evtMeasures = evt.toElement.getBoundingClientRect();
      store.dispatch(
        drop({
          id: evt.toElement.id,
          x: evtMeasures.x,
          y: evtMeasures.y
        })
      );
    } else store.dispatch(drop({}));

    window.dragging = undefined;
  }
};
