import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { selectConnector } from "../actions/connectorsActions";

import {
  polylinePointsTransformation,
  intermediatePointsCalculator
} from "../helpers/connectorPointsCalculator";

class Connector extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let from = this.props.endPoints[0];
    let to = this.props.endPoints[1];
    console.log("connector", from, to, this.props.intermediatePoints);

    const points = this.props.drawing
      ? [from, to]
      : intermediatePointsCalculator(from, to, 10);

    let midPoints = [];

    if (this.props.selected) {
      for (let i = 1; i < points.length - 1; i++) {
        midPoints.push(points[i]);
      }
    }

    return (
      <g>
        <polyline
          style={{
            pointerEvents: this.props.drawing ? "none" : "stroke",
            fill: "none"
          }}
          points={polylinePointsTransformation(points)}
          stroke="black"
          strokeWidth="3"
          markerEnd="url(#triangle)"
          onClick={evt => {
            this.props.select({ id: this.props.id });
          }}
        />
        {midPoints.map(p => {
          return <circle cx={p.x} cy={p.y} r="7" fill="green" />;
        })}
      </g>
    );
  }
}

const mapDispatchToProps = {
  select: selectConnector
};

const mapStateToProps = (state, ownProps) => ({
  ...state.elements.connectors[ownProps.id]
});

export default connect(mapStateToProps, mapDispatchToProps)(Connector);
