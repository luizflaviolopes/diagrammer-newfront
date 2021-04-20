import store from "../../store";
import { mouseDown, dragging, drop, drawClick } from "../../actions/drawing";

export const IsDraw = (element) => {
  if (element.getAttribute("draw")) return true;
  else return false;
};

export const onDrawDragStart = (evt) => {
  const mousePressedObject = evt.target;
  const objectId = evt.target.id;
  let moved = false;

  store.dispatch(
    mouseDown({
      id: objectId,
      shiftPressed: evt.shiftKey,
      clientRectPosition: mousePressedObject.getBoundingClientRect(),
      mousePosition: { x: evt.clientX, y: evt.clientY },
    })
  );

  return {
    dragging: (evt) => {
      if(!moved){
        moved = true;
      }

      store.dispatch(
        dragging({ id: objectId, mousePosition: { x: evt.clientX, y: evt.clientY } })
      );
    },

    drop:(evt) => {
      if(!moved)
      {
        store.dispatch(drawClick())
        return;
      }

      if (IsDraw(evt.toElement)) {
        const elementDestination = evt.toElement;
        const evtMeasures = elementDestination.getBoundingClientRect();
        store.dispatch(
          drop({
            id: elementDestination.id,
            parentRect: { x: evtMeasures.x, y: evtMeasures.y },
            mousePosition: { x: evt.clientX, y: evt.clientY },
          })
        );
      } else
        store.dispatch(drop({ mousePosition: { x: evt.clientX, y: evt.clientY } }));
    }
  }

};