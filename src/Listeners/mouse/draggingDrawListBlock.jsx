import store from "../../store";
import {
  dragBlock,
  dropBlockOutOfBoard,
} from "../../actions/tabDrawListBoxActions";
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
    type: evt.target.getAttribute("type"),
  };
};

export const onDrawDragging = (evt) => {
  if (evt.toElement.id == "surface" && !window.dragging.created) {
    window.dragging.created = true;

    store.dispatch(
      dragBlock({
        position: {
          x: window.dragging.startPosition.x,
          y: window.dragging.startPosition.y,
        },
        type: window.dragging.type,
      })
    );
  }
  if (window.dragging.created) {
    let x = evt.clientX - window.dragging.startPosition.x;
    let y = evt.clientY - window.dragging.startPosition.y;
    store.dispatch(dragging({ position: { x: x, y: y } }));
  }
};

export const onDrawDrop = (evt) => {
  //console.log(evt);

  if (IsDraw(evt.toElement)) {
    let evtMeasures = evt.toElement.getBoundingClientRect();
    store.dispatch(
      drop({
        id: evt.toElement.id,
        x: evtMeasures.x,
        y: evtMeasures.y,
      })
    );
  } else if (evt.toElement.id == "surface") store.dispatch(drop({}));
  else {
    store.dispatch(dropBlockOutOfBoard({}));
  }

  window.dragging = undefined;
};
