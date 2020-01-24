import React, { Component, useState } from "react";
import ReactDOM from "react-dom";

import elementTypeResolver from "../helpers/elementTypeResolver";
import { event, drag, select } from "d3";

export class DrawWrapper extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let _this = this;
    const handleDrag = drag()
      .subject(function() {
        const me = select(this);
        return { x: me.attr("x"), y: me.attr("y") };
      })
      .on("drag", function() {
        const me = select(this);
        me.attr("transform", `translate(${event.x}, ${event.y})`);
        me.attr("x", event.x);
        me.attr("y", event.y);

        let center = _this.calcCenter(event.x, event.y);
        for (let i = 0; i < _this.props.connectors.length; i++) {
          _this.props.moving(
            _this.props.connectors[i].id,
            _this.props.connectors[i].type,
            center.x,
            center.y
          );
        }
      })
      .on("end", function() {
        console.log("dropped");
      });

    const handleDrop = drag().on("end", function() {
      console.log("dropped");
    });
    const node = ReactDOM.findDOMNode(this);
    handleDrag(select(node));
  }

  calcCenter = (x, y) => {
    if (this.props.radius) return { x: x, y: y };
    return {
      x: x + this.props.width / 2,
      y: y + this.props.heigth / 2
    };
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

export default DrawWrapper;
