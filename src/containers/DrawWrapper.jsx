import React, { Component, useState } from "react";
import { connect } from "react-redux";

import * as drawActions from "../actions/drawing";
import elementTypeResolver from "../helpers/elementTypeResolver";
import ConnectionPoints from "../components/ConnectionPoints";

import elementsConnectorPointsCalculator from "../helpers/elementsConnectorPointsCalculator";

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

  onDragOver = (evt) => {
    if (
      this.props.sessionState.connectorDrawing
    ) {
      this.setState({ highlightConnector: true });
    } else if (
      this.props.sessionState.draggingElement &&
      !this.props.selected
    ) {
      this.setState({ highlightDrawDragging: true });
    }
  };

  onDragOut = (evt) => {
    if (this.state.highlightConnector) {
      this.setState({
        highlightConnector: false,
      });
    }
    if (this.state.highlightDrawDragging) {
      this.setState({ highlightDrawDragging: false });
    }
  };

  render() {
    console.log("update", this.props.id);
    const Element = elementTypeResolver(this.props.type);
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

    if (this.props.childrens ) {
      childrens = this.props.childrens.map((element) => {
        console.log("renderizando filho");
        return <DrawWrapperConnected key={element} id={element} />;
      });
    }

    const calcPointerEvents = () => {
      if (this.props.sessionState.draggingElement && this.props.selected)
        return "none";
      else return "painted";
    };
    const pointerEvents = calcPointerEvents();

    return (
      <g
        onMouseOver={this.onDragOver}
        onMouseOut={this.onDragOut}
        transform={`translate(${this.props.x}, ${this.props.y})`}
      >
        <g
          onMouseEnter={(evt) => {
            this.setState({ showConnectors: true });
          }}
          onMouseLeave={() => this.setState({ showConnectors: false })}
        >
          <Element
            text={this.props.text}
            heigth={this.props.heigth}
            width={this.props.width}
            radius={this.props.radius}
            highlightConnection={this.state.highlightConnector}
            highlightDrawDragging={this.state.highlightDrawDragging}
            selected={this.props.selected}
            id={this.props.id}
            pointerEvents={pointerEvents}
          />
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
