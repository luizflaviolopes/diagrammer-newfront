import React from "react";
import * as drawActions from "../actions/drawing";
import { connect } from "react-redux";

class ConnectionPoints extends React.Component {
  constructor(props) {
    super(props);
  }

  onDragStart = _this => {
    this.props.connectorDrawingStart({
      id: this.props.elementId,
      variant: { x: this.props.x, y: this.props.y }
    });

    // let rectPos = _this.getBoundingClientRect();
    // return {
    //   x: rectPos.left + (rectPos.right - rectPos.left) / 2,
    //   y: rectPos.top + (rectPos.bottom - rectPos.top) / 2
    // };
  };

  onDrag = evt => {
    if (evt.sourceEvent.toElement.id === "anchorPoint") {
      let rectPos = evt.sourceEvent.toElement.getBoundingClientRect();
      this.props.connectorDrawing({
        x: rectPos.left + (rectPos.right - rectPos.left) / 2,
        y: rectPos.top + (rectPos.bottom - rectPos.top) / 2
      });
    } else
      this.props.connectorDrawing({
        x: evt.sourceEvent.clientX,
        y: evt.sourceEvent.clientY
      });
  };

  onDragEnd = evt => {
    if (evt.sourceEvent.toElement.id === "anchorPoint") {
      this.props.connectorDrawingEnd({
        id: evt.sourceEvent.toElement.getAttribute("element"),
        variants: {
          x: +evt.sourceEvent.toElement.getAttribute("cx"),
          y: +evt.sourceEvent.toElement.getAttribute("cy")
        }
      });
    } else this.props.connectorDrawingEnd(undefined);
  };

  render() {
    return (
      <circle
        id="anchorPoint"
        cx={this.props.x}
        cy={this.props.y}
        r="7"
        fill="steelblue"
        element={this.props.elementId}
      />
    );
  }
}

const mapDispatchToProps = {
  connectorDrawing: drawActions.connectorDrawing,
  connectorDrawingStart: drawActions.connectorDrawingStart,
  connectorDrawingEnd: drawActions.connectorDrawingEnd
};

export default connect(null, mapDispatchToProps)(ConnectionPoints);
