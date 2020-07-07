import store from "../../store";

const sendFrontNotification = (action) => {
  store.dispatch(action);
};

export default sendFrontNotification;
