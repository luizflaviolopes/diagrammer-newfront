import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import * as drawActions from "../actions/drawing";

import ConnectionPoints from "../components/ConnectionPoints";

import elementsConnectorPointsCalculator from "../helpers/elementsConnectorPointsCalculator";
import DrawAdapter from "../components/DrawAdapter";
import DrawFrame from "../components/DrawFrame";

class DrawWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConnectors: false,
    };
  }

  componentDidUpdate = () => {};

  render() {
    let connectionPoints = null;
    let childrens = null;

    const getConnectors = () => {
      let points = elementsConnectorPointsCalculator(
        this.props.type,
        this.props.width,
        this.props.height
      );

      connectionPoints = points.map((point) => (
        <ConnectionPoints
          elementId={this.props.id}
          key={point.pointRef}
          {...point}
        />
      ));

      return connectionPoints;
    };

    if (this.props.childrens) {
      childrens = this.props.childrens.map((element) => {
        return <DrawWrapperConnected key={element} id={element} />;
      });
    }

    let markers = [];
    if (this.props.resizePoints) markers = this.props.resizePoints;

    const selected = this.props.selecteds[this.props.id];

    const DrawRender = (
      <g
        transform={`translate(${
          selected ? this.props.absolutePosition.x : this.props.x
        }, ${selected ? this.props.absolutePosition.y : this.props.y})`}
      >
        <g
          onMouseEnter={(evt) => {
            if (!this.props.onDragging) this.setState({ showConnectors: true });
          }}
          onMouseLeave={() => this.setState({ showConnectors: false })}
        >
          <DrawAdapter
            {...this.props}
            selected={selected ? true : false}
          ></DrawAdapter>
          {this.state.showConnectors && getConnectors()}
          {/* {getConnectors()} */}
          {selected && (
            <DrawFrame
              height={this.props.height}
              width={this.props.width}
              drawId={this.props.id}
            ></DrawFrame>
          )}
        </g>
        {childrens}
      </g>
    );

    if (this.props.selecteds[this.props.id])
      return ReactDOM.createPortal(
        DrawRender,
        document.getElementById("selectDraws")
      );
    return DrawRender;
  }
}

const mapDispatchToProps = {
  mouseDown: drawActions.mouseDown,
  dragging: drawActions.dragging,
  drop: drawActions.drop,
  select: drawActions.selectDraw,
};

const mapStateToProps = (state, ownProps) => ({
  ...state.elements.draws[ownProps.id],
  selecteds: state.context.selectedDraws,
  onDragging: state.context.dragging,
  connectorDrawing: state.context.connectorDrawing,
});

const DrawWrapperConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawWrapper);

export default DrawWrapperConnected;
