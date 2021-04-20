import store from "../../store";
import {
  connectorDrawing,
  connectorDrawingStart,
  connectorDrawingEnd,
} from "../../actions/drawing";

export const IsConnector = (element) => {
  if (element.id == "anchorPoint") return true;
  else return false;
};

export const onDrawConnectorStart = (evt) => {
  const elementStart = evt.target;
  const elementStartId = elementStart.getAttribute("element");
  const startClientRect = elementStart.getBoundingClientRect();

  store.dispatch(
    connectorDrawingStart({
      id: elementStartId,
      mousePosition: {
        x: startClientRect.x + startClientRect.width / 2,
        y: startClientRect.y + startClientRect.height / 2,
      },
      variant: {
        pointref: evt.target.getAttribute("pointref"),
        angle: +evt.target.getAttribute("angle"),
      },
    })
  );

  return {
    dragging: (evt) => {
    if (evt.toElement.id === "anchorPoint") {
      const destinationElement = evt.toElement;
      const  rectPos = destinationElement.getBoundingClientRect();

    store.dispatch(
      connectorDrawing({
        mousePosition: {
          x: rectPos.left + (rectPos.right - rectPos.left) / 2,
          y: rectPos.top + (rectPos.bottom - rectPos.top) / 2,
        },
        angle: +destinationElement.getAttribute("angle"),
      })
    );
  } else
    store.dispatch(
      connectorDrawing({
        mousePosition: {
          x: evt.clientX,
          y: evt.clientY,
        },
      })
    );
  },

    drop:(evt) => {
        if (evt.toElement.id === "anchorPoint") {
          const destinationElement = evt.toElement;
          const clientRect = destinationElement.getBoundingClientRect();
          const destinationElementId = destinationElement.getAttribute("element");

          store.dispatch(
            connectorDrawingEnd({
              id: destinationElementId,
              mousePosition: {
                x: clientRect.x + clientRect.width / 2,
                y: clientRect.y + clientRect.height / 2,
              },
              variants: {
                pointref: destinationElement.getAttribute("pointref"),
                angle: +destinationElement.getAttribute("angle"),
              },
            })
          );
        } else store.dispatch(connectorDrawingEnd(undefined));
      }
    }
};

