import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { selectConnector } from "../actions/connectorsActions";

import {
  polylinePointsTransformation,
  intermediatePointsCalculator,
} from "../helpers/connectorPointsCalculator";

class Connector extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const selected = this.props.selcteds.includes(this.props.id);
    let pointerEvent = "stroke";

    if (this.props.drawing || this.props.onDrawDragging) {
      pointerEvent = "none";
    }
    let from = this.props.endPoints[0];
    let to = this.props.endPoints[1];

    // const points = this.props.drawing
    //   ? [from, to]
    //   : intermediatePointsCalculator(from, to, 10);

    const points = intermediatePointsCalculator(from, to, 50);

    let midPoints = [];

    if (selected) {
      for (let i = 1; i < points.length - 1; i++) {
        midPoints.push(points[i]);
      }
    }

    return (
      <g>
        <path
          style={{
            pointerEvents: pointerEvent,
            fill: "none",
          }}
          d={polylinePointsTransformation(points)}
          stroke="black"
          strokeWidth="3"
          markerEnd="url(#triangle)"
          onClick={(evt) => {
            this.props.select({
              id: this.props.id,
              shiftPressed: evt.shiftKey,
            });
          }}
          strokeDasharray={selected ? 2 : "none"}
        />
        {/* {points.map((p, i) => {
          if (i == 0 || i == 3) return null;
          return (
            <circle
              cx={p.x + from.x}
              cy={p.y + from.y}
              r="7"
              fill="green"
              style={{
                pointerEvents: "none",
              }}
            />
          );
        })} */}
      </g>
    );
  }
}

const mapDispatchToProps = {
  select: selectConnector,
};

const mapStateToProps = (state, ownProps) => ({
  ...state.elements.connectors[ownProps.id],
  onDrawDragging: state.elements.sessionState.draggingElement,
  selcteds: state.context.selectedConnectors,
});

export default connect(mapStateToProps, mapDispatchToProps)(Connector);
