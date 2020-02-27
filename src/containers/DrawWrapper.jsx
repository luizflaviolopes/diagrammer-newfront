import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import * as drawActions from "../actions/drawing";
import elementTypeResolver from "../helpers/elementTypeResolver";
import elementCenterCalculator from "../helpers/elementCenterCalculator";
import ConnectionPoints from "../components/ConnectionPoints";

import elementsConnectorPointsCalculator from "../helpers/elementsConnectorPointsCalculator";
import Connector from "./Connector";

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
          : "bounding-box"
    };
    this.connectionPoints = elementsConnectorPointsCalculator(
      props.type,
      props.width,
      props.heigth,
      props.radius
    );
    this.centerCalc = elementCenterCalculator(props.type);
  }

  componentDidUpdate = () => {
    console.log("update", this.props.id);
  };

  onDragOver = evt => {
    if (
      this.props.sessionState.connectorDrawing &&
      this.props.sessionState.elementDragStart.id != this.props.id
    ) {
      this.setState({ highlightConnector: true });
    } else if (
      this.props.sessionState.draggingElement &&
      !this.props.selected
    ) {
      this.setState({ highlightDrawDragging: true });
    }
  };

  onDragOut = evt => {
    if (this.state.highlightConnector) {
      this.setState({
        highlightConnector: false
      });
    }
    if (this.state.highlightDrawDragging) {
      this.setState({ highlightDrawDragging: false });
    }
  };

  renderConnectors = () => {
    if (this.props.connectors) {
      return this.props.connectors.map(conn => {
        console.log("rendering connector ", conn);
        return <Connector key={conn.id} id={conn.id} />;
      });
    } else return null;
  };

  render() {
    const Element = elementTypeResolver(this.props.type);
    let connectionPoints = null;
    let childrens = null;

    if (this.state.showConnectors) {
      connectionPoints = this.connectionPoints.map(point => (
        <ConnectionPoints
          x={point.x}
          y={point.y}
          elementId={this.props.id}
          key={point.ref}
        />
      ));
    }

    if (this.props.childrens) {
      childrens = this.props.childrens.map(element => {
        // const draw = this.props.allDraws[element];
        console.log("renderizando filho");
        return <DrawWrapperConnected key={element} id={element} />;
      });
    }

    const calcPointerEvents = () => {
      if (this.props.sessionState.draggingElement && this.props.selected)
        return "none";
      else return "bounding-box";
    };
    const pointerEvents = calcPointerEvents();

    return (
      <React.Fragment>
        <g
          transform={`translate(${this.props.x}, ${this.props.y})`}
          onMouseOver={this.onDragOver}
          onMouseOut={this.onDragOut}
        >
          <g
            onMouseEnter={evt => {
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
          <g>{childrens}</g>
        </g>
        {this.renderConnectors()}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = {
  clearHighlightDrawDragging: drawActions.clearHighlightDrawDragging,
  mouseDown: drawActions.mouseDown,
  dragging: drawActions.dragging,
  drop: drawActions.drop,
  select: drawActions.selectDraw
};

const mapStateToProps = (state, ownProps) => ({
  sessionState: state.elements.sessionState,
  ...state.elements.draws[ownProps.id]
});

const DrawWrapperConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawWrapper);

export default DrawWrapperConnected;
