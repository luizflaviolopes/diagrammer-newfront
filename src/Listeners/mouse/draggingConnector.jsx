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
    onMove: onConnectorDragging,
    onDrop: onConnectorDrop
  };
  let clientRect = evt.target.getBoundingClientRect();
  store.dispatch(
    connectorDrawingStart({
      id: evt.target.getAttribute("element"),
      variant: {
        absolutePosition: {x: clientRect.x + clientRect.width / 2, y: clientRect.y + clientRect.height / 2},
        pointRef: evt.target.getAttribute("pointRef"),
        angle: +evt.target.getAttribute("angle")
      }
    })
  );
};

const onConnectorDragging = evt => {
  if (evt.toElement.id === "anchorPoint") {
    let rectPos = evt.toElement.getBoundingClientRect();
    store.dispatch(
      connectorDrawing({
        x: rectPos.left + (rectPos.right - rectPos.left) / 2,
        y: rectPos.top + (rectPos.bottom - rectPos.top) / 2,
        angle: +evt.toElement.getAttribute("angle")
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

const onConnectorDrop = evt => {
  if (window.dragging) {
    window.dragging = undefined;
    if (evt.toElement.id === "anchorPoint") {
      let clientRect = evt.toElement.getBoundingClientRect();
      store.dispatch(
        connectorDrawingEnd({
          id: evt.toElement.getAttribute("element"),
          variants: {
            absolutePosition: {x: clientRect.x + clientRect.width / 2, y: clientRect.y + clientRect.height / 2},
            pointRef: evt.toElement.getAttribute("pointRef"),
            angle: +evt.toElement.getAttribute("angle")
          }
        })
      );
    } else store.dispatch(connectorDrawingEnd(undefined));
  }
};
