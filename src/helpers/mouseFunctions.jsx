import ReactDOM from "react-dom";
import { event, drag, select } from "d3";

const subjectFunctionDefault = _this => {
  const me = select(_this);
  return { x: me.attr("x"), y: me.attr("y") };
};

export const bindDrag = (
  element,
  subjectFunction = subjectFunctionDefault,
  dragFunction = () => {},
  dropFunction = () => {}
) => {
  const handleDrag = drag()
    .subject(function() {
      //console.log(this);
      return subjectFunction(this);
    })
    .on("drag", function() {
      dragFunction(event);
    })
    .on("end", function() {
      dropFunction(event);
    });

  const node = ReactDOM.findDOMNode(element);
  handleDrag(select(node));
};
