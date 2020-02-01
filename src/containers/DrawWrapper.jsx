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
    bindDrag(this, undefined, this.onDrag, evt => {
      console.log(evt);
    });
  }

  onDrag = evt => {
    console.log(evt.x, evt.y);
    let center = this.centerCalc(
      evt.x,
      evt.y,
      this.props.width,
      this.props.heigth
    );

    this.props.dragging({
      id: this.props.id,
      position: { x: evt.x, y: evt.y }
      //movement: { x: evt.x - evt.subject.x, y: evt.y - evt.subject.y }
    });
  };

  onDragOver = () => {
    if (
      this.props.transients.connectorDrawing &&
      this.props.transient.elementDragStartId != this.props.id
    ) {
      this.setState({ highlightConnector: true });
    }
  };

  onDragOver = () => {
    if (
      this.props.transients.connectorDrawing &&
      this.props.transients.elementDragStartId != this.props.id
    ) {
      this.setState({ highlightConnector: true });
    }
  };

  onDragOut = () => {
    if (this.state.highlightConnector) {
      this.setState({ highlightConnector: false });
    }
  };

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
      >
        <Element
          text={this.props.text}
          heigth={this.props.heigth}
          width={this.props.width}
          radius={this.props.radius}
          highlightConnection={this.state.highlightConnector}
        />
        {connectionPoints}
      </g>
    );
  }
}

const mapDispatchToProps = {
  dragging: drawActions.dragging
};

const mapStateToProps = state => ({
  transients: state.elements.transients
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawWrapper);
