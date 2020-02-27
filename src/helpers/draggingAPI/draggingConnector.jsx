import store from "../../store";
import {
  connectorDrawing,
  connectorDrawingStart,
  connectorDrawingEnd
} from "../../actions/drawing";

export const IsConnector = element => {
  if (element.id == "anchorPoint") return true;
  else return false;
};

export const onDrawConnectorStart = evt => {
  window.dragging = {
    onMove: onDrawDragging,
    onDrop: onDrawDrop
  };
  store.dispatch(
    connectorDrawingStart({
      id: evt.target.getAttribute("element"),
      variant: {
        x: +evt.target.getAttribute("cx"),
        y: +evt.target.getAttribute("cy")
      }
    })
  );
};

export const onDrawDragging = evt => {
  if (evt.toElement.id === "anchorPoint") {
    let rectPos = evt.toElement.getBoundingClientRect();
    store.dispatch(
      connectorDrawing({
        x: rectPos.left + (rectPos.right - rectPos.left) / 2,
        y: rectPos.top + (rectPos.bottom - rectPos.top) / 2
      })
    );
  } else
    store.dispatch(
      connectorDrawing({
        x: evt.clientX,
        y: evt.clientY
      })
    );
};

export const onDrawDrop = evt => {
  if (window.dragging) {
    window.dragging = undefined;
    if (evt.toElement.id === "anchorPoint") {
      store.dispatch(
        connectorDrawingEnd({
          id: evt.toElement.getAttribute("element"),
          variants: {
            x: +evt.toElement.getAttribute("cx"),
            y: +evt.toElement.getAttribute("cy")
          }
        })
      );
    } else store.dispatch(connectorDrawingEnd(undefined));
  }
};
