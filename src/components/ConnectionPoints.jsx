import React from "react";
import * as drawActions from "../actions/drawing";
import { connect } from "react-redux";

const ConnectionPoints = (props) => {
  // onDragStart = _this => {
  //   this.props.connectorDrawingStart({
  //     id: this.props.elementId,
  //     variant: { x: this.props.x, y: this.props.y }
  //   });

  //   // let rectPos = _this.getBoundingClientRect();
  //   // return {
  //   //   x: rectPos.left + (rectPos.right - rectPos.left) / 2,
  //   //   y: rectPos.top + (rectPos.bottom - rectPos.top) / 2
  //   // };
  // };

  // onDrag = evt => {
  //   if (evt.sourceEvent.toElement.id === "anchorPoint") {
  //     let rectPos = evt.sourceEvent.toElement.getBoundingClientRect();
  //     this.props.connectorDrawing({
  //       x: rectPos.left + (rectPos.right - rectPos.left) / 2,
  //       y: rectPos.top + (rectPos.bottom - rectPos.top) / 2
  //     });
  //   } else
  //     this.props.connectorDrawing({
  //       x: evt.sourceEvent.clientX,
  //       y: evt.sourceEvent.clientY
  //     });
  // };

  // onDragEnd = evt => {
  //   if (evt.sourceEvent.toElement.id === "anchorPoint") {
  //     this.props.connectorDrawingEnd({
  //       id: evt.sourceEvent.toElement.getAttribute("element"),
  //       variants: {
  //         x: +evt.sourceEvent.toElement.getAttribute("cx"),
  //         y: +evt.sourceEvent.toElement.getAttribute("cy")
  //       }
  //     });
  //   } else this.props.connectorDrawingEnd(undefined);
  // };

  return (
    <React.Fragment>
      <polyline
        points={`${props.x + 5} ${props.y + 6} ${props.x + 10} ${props.y} ${
          props.x + 5
        } ${props.y - 6}`}
        id="anchorPointDummy"
        pointref={props.pointref}
        fill="steelblue"
        element={props.elementId}
        angle={props.angle}
        transform={`rotate(${-props.angle} ${props.x} ${props.y})`}
      />
      <polyline
        points={`${props.x} ${props.y + 10} ${props.x + 12} ${props.y} ${
          props.x
        } ${props.y - 10}`}
        id="anchorPoint"
        pointref={props.pointref}
        fill="white"
        opacity="0"
        element={props.elementId}
        angle={props.angle}
        transform={`rotate(${-props.angle} ${props.x} ${props.y})`}
      />
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  connectorDrawing: drawActions.connectorDrawing,
  connectorDrawingStart: drawActions.connectorDrawingStart,
  connectorDrawingEnd: drawActions.connectorDrawingEnd,
};

export default connect(null, mapDispatchToProps)(ConnectionPoints);
