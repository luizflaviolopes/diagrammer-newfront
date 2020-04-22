import store from "../../store";
import { dragBlock } from "../../actions/tabDrawListBoxActions";
import { dragging, drop } from "../../actions/drawing";
import { IsDraw } from "./draggingDraw";

export const IsDrawListBoxBlock = (element) => {
  if (element.getAttribute("draw")) return true;
  else return false;
};

export const onDragStart = (evt) => {
  window.dragging = {
    onMove: onDrawDragging,
    onDrop: onDrawDrop,
    startPosition: { x: evt.clientX, y: evt.clientY },
  };

  let drawType = evt.target.getAttribute("type");

  store.dispatch(
    dragBlock({
      position: { x: evt.clientX, y: evt.clientY },
      type: drawType,
    })
  );
};

export const onDrawDragging = (evt) => {
  let x = evt.clientX - window.dragging.startPosition.x;
  let y = evt.clientY - window.dragging.startPosition.y;
  store.dispatch(dragging({ position: { x: x, y: y } }));
};

export const onDrawDrop = (evt) => {
  console.log(evt);

  if (IsDraw(evt.toElement)) {
    let evtMeasures = evt.toElement.getBoundingClientRect();
    store.dispatch(
      drop({
        id: evt.toElement.id,
        x: evtMeasures.x,
        y: evtMeasures.y,
      })
    );
  } else store.dispatch(drop({}));

  window.dragging = undefined;
};
