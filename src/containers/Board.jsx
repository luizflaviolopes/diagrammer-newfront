import React from "react";
import { connect } from "react-redux";
import Grid from "../components/Grid.jsx";
import * as elementTypes from "../types/ElementTypes";
import * as drawActions from "../actions/drawing";

import DrawWraper from "./DrawWrapper.jsx";
import Line from "../components/Line.jsx";

const Board = props => {
  const drawConnectors = () => {
    return Object.keys(props.elements.connectors).map(id => {
      const connector = { ...props.elements.connectors[id] };
      const conectedElements = Object.keys(connector);
      return (
        <Line
          key={id}
          from={connector[conectedElements[0]]}
          to={connector[conectedElements[1]]}
        />
      );
    });
  };

  const drawElements = () => {
    return Object.keys(props.elements.draws).map(itemId => {
      const item = { id: itemId, ...props.elements.draws[itemId] };

      return <DrawWraper key={itemId} {...item} />;
    });
  };

  const addElement = evt => {
    props.addElement({
      type: props.selectedElement,
      position: { x: evt.pageX, y: evt.pageY }
    });
  };

  return (
    <div style={{ height: "100%" }}>
      <svg id="svg" width="100%" height="100%">
        <Grid
          offsetX={props.boardView.viewX}
          offsetY={props.boardView.viewY}
          onDoubleClick={addElement}
        />
        <g
          transform={`translate(${props.boardView.viewX},${props.boardView.viewY})`}
        >
          {drawConnectors()}
          {drawElements()}
        </g>
      </svg>
    </div>
  );
};

const mapDispatchToProps = {
  addElement: drawActions.addElement
};

const mapStateToProps = state => ({
  boardView: state.boardView,
  elements: state.elements,
  selectedElement: state.toolboxElements.elementSelected
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
