import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import * as drawActions from "../actions/drawing";
import elementTypeResolver from "../helpers/elementTypeResolver";
import elementCenterCalculator from "../helpers/elementCenterCalculator";
import ConnectionPoints from "../components/ConnectionPoints";

import { event, drag, select } from "d3";
import { bindDrag } from "../helpers/mouseFunctions";
import elementsConnectorPointsCalculator from "../helpers/elementsConnectorPointsCalculator";

export class DrawWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { showConnectors: false, highlightConnector: false };
    this.connectionPoints = elementsConnectorPointsCalculator(
      props.type,
      props.width,
      props.heigth,
      props.radius
    );
    this.centerCalc = elementCenterCalculator(props.type);
  }

  componentDidMount() {
    bindDrag(this, this.onMouseDown, this.onDrag, this.onDrop);
  }

  onMouseDown = evt => {
    if (!this.props.selected) {
      this.props.mouseDown({
        id: this.props.id,
        shiftPressed: evt.sourceEvent.shiftKey
      });
    }
  };

  onDrag = evt => {
    this.props.dragging({
      id: this.props.id,
      position: { x: evt.x, y: evt.y }
    });
  };

  onDrop = evt => {
    this.props.drop({});
  };

  onDragOver = () => {
    if (
      this.props.sessionState.connectorDrawing &&
      this.props.sessionState.elementDragStartId != this.props.id
    ) {
      this.setState({ highlightConnector: true });
    }
  };

  onDragOut = () => {
    if (this.state.highlightConnector) {
      this.setState({ highlightConnector: false });
    }
  };

  // onClick = evt => {
  //   if (!this.props.selected)
  //     if (evt.shiftKey) this.props.addSelect({ id: this.props.id });
  //     else this.props.select({ id: this.props.id });
  // };

  render() {
    const Element = elementTypeResolver(this.props.type);
    let connectionPoints = null;
    if (this.state.showConnectors) {
      connectionPoints = this.connectionPoints.map(point => (
        <ConnectionPoints
          x={point.x}
          y={point.y}
          elementId={this.props.id}
          ref={point.ref}
          key={point.ref}
        />
      ));
    }

    return (
      <g
        x={this.props.x}
        y={this.props.y}
        transform={`translate(${this.props.x}, ${this.props.y})`}
        onMouseEnter={() => this.setState({ showConnectors: true })}
        onMouseLeave={() => this.setState({ showConnectors: false })}
        onMouseOver={this.onDragOver}
        onMouseOut={this.onDragOut}
        // onClick={this.onClick}
      >
        <Element
          text={this.props.text}
          heigth={this.props.heigth}
          width={this.props.width}
          radius={this.props.radius}
          highlightConnection={this.state.highlightConnector}
          selected={this.props.selected}
        />
        {connectionPoints}
      </g>
    );
  }
}

const mapDispatchToProps = {
  mouseDown: drawActions.mouseDown,
  dragging: drawActions.dragging,
  drop: drawActions.drop,
  select: drawActions.selectDraw,
  addSelect: drawActions.addSelectDraw
};

const mapStateToProps = state => ({
  sessionState: state.elements.sessionState
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawWrapper);
