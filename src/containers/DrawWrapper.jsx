import React, { Component, useState } from "react";
import { connect } from "react-redux";

import * as drawActions from "../actions/drawing";

import ConnectionPoints from "../components/ConnectionPoints";

import elementsConnectorPointsCalculator from "../helpers/elementsConnectorPointsCalculator";
import DrawAdapter from "../components/DrawAdapter";

class DrawWrapper extends Component {
  constructor(props) {
    super(props);
    console.log("construindo", props.id);
    this.state = {
      showConnectors: false,
      highlightConnector: false,
      highlightDrawDragging: false,
      pointerEvents:
        props.sessionState.draggingElement && props.selected
          ? "none"
          : "painted",
    };

    // this.centerCalc = elementCenterCalculator(props.type);
  }

  componentDidUpdate = () => {};

  render() {
    console.log("update", this.props.id);

    let connectionPoints = null;
    let childrens = null;

    if (this.state.showConnectors) {
      let points = elementsConnectorPointsCalculator(
        this.props.type,
        this.props.width,
        this.props.heigth,
        this.props.radius
      );

      connectionPoints = points.map((point) => (
        <ConnectionPoints
          elementId={this.props.id}
          key={point.pointRef}
          {...point}
        />
      ));
    }

    if (this.props.childrens) {
      childrens = this.props.childrens.map((element) => {
        console.log("renderizando filho");
        return <DrawWrapperConnected key={element} id={element} />;
      });
    }

    let markers = [];
    if (this.props.resizePoints) markers = this.props.resizePoints;

    return (
      <g transform={`translate(${this.props.x}, ${this.props.y})`}>
        <g
          onMouseEnter={(evt) => {
            if (!this.props.sessionState.draggingElement)
              this.setState({ showConnectors: true });
          }}
          onMouseLeave={() => this.setState({ showConnectors: false })}
        >
          <DrawAdapter {...this.props}></DrawAdapter>
          {connectionPoints}
        </g>
        {childrens}
      </g>
    );
  }
}

const mapDispatchToProps = {
  clearHighlightDrawDragging: drawActions.clearHighlightDrawDragging,
  mouseDown: drawActions.mouseDown,
  dragging: drawActions.dragging,
  drop: drawActions.drop,
  select: drawActions.selectDraw,
};

const mapStateToProps = (state, ownProps) => ({
  sessionState: state.elements.sessionState,
  ...state.elements.draws[ownProps.id],
});

const DrawWrapperConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawWrapper);

export default DrawWrapperConnected;
