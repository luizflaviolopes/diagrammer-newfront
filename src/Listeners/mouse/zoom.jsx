import store from "../../store";
import { zoomAction } from "../../actions/boardViewActions";

export const changeZoom = (evt) => {
  console.log(evt);
  store.dispatch(
    zoomAction({
      value: evt.deltaY,
      mousePosition: { x: evt.clientX, y: evt.clientY },
    })
  );
};
