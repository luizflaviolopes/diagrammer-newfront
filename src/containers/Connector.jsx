import React, { Component, useState } from "react";
import { connect } from "react-redux";

class Connector extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let from = this.props.endPoints[Object.keys(this.props.endPoints)[0]];
    let to = this.props.endPoints[Object.keys(this.props.endPoints)[1]];
    console.log(from, to);

    if (this.props.posRef) {
      console.log("corrigindo connector");
      const originalPosition = this.props.endPoints[this.props.posRef.id];
      const posVariation = {
        x: originalPosition.x - this.props.posRef.x,
        y: originalPosition.y - this.props.posRef.y
      };

      from = { x: from.x - posVariation.x, y: from.y - posVariation.y };
      to = { x: to.x - posVariation.x, y: to.y - posVariation.y };
    }

    return (
      <line
        style={{ pointerEvents: this.props.prov ? "none" : "all" }}
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="black"
        strokeWidth="3"
      />
    );
  }
}

const mapDispatchToProps = {};

const mapStateToProps = (state, ownProps) => ({
  endPoints: state.elements.connectors[ownProps.id].endPoints
});

export default connect(mapStateToProps, mapDispatchToProps)(Connector);
