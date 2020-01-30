import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import * as drawActions from "../actions/drawing";
import elementTypeResolver from "../helpers/elementTypeResolver";
import elementCenterCalculator from "../helpers/elementCenterCalculator";

import { event, drag, select } from "d3";

export class DrawWrapper extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.BindDrag(this);
  }

  BindDrag = _this => {
    let centerCalc = elementCenterCalculator(_this.props.type);

    const handleDrag = drag()
      .subject(function() {
        const me = select(this);
        return { x: me.attr("x"), y: me.attr("y") };
      })
      .on("drag", function() {
        const me = select(this);
        // me.attr("transform", `translate(${event.x}, ${event.y})`);
        // me.attr("x", event.x);
        // me.attr("y", event.y);
        let center = centerCalc(
          event.x,
          event.y,
          _this.props.width,
          _this.props.heigth
        );
        _this.props.dragging({
          id: _this.props.id,
          position: { x: event.x, y: event.y },
          center: center
        });
      });
    // .on("end", function() {
    //   console.log("dropped");
    // });

    const node = ReactDOM.findDOMNode(this);
    handleDrag(select(node));
  };

  render() {
    const Element = elementTypeResolver(this.props.type);
    return (
      <g
        x={this.props.x}
        y={this.props.y}
        transform={`translate(${this.props.x}, ${this.props.y})`}
      >
        <Element
          text={this.props.text}
          heigth={this.props.heigth}
          width={this.props.width}
          radius={this.props.radius}
        />
      </g>
    );
  }
}

const mapDispatchToProps = {
  dragging: drawActions.dragging
};

export default connect(null, mapDispatchToProps)(DrawWrapper);
