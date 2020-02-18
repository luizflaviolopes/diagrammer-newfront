import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import Grid from "../components/Grid.jsx";
import * as drawActions from "../actions/drawing";

import draggingAPI from "../helpers/draggingDrawAPI.jsx";

import DrawWraper from "./DrawWrapper.jsx";
import Line from "../components/Line.jsx";

const Board = props => {
  useEffect(() => {
    draggingAPI.startDrag();
    return draggingAPI.endDrag;
  }, []);

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

  const drawDraws = () => {
    return props.showSequence.map(itemId => {
      const item = props.elements.draws[itemId];
      console.log("rendering", itemId);
      return <DrawWraper key={item.id} {...item} />;
    });
  };

  const addDraw = evt => {
    props.addDraw({
      type: props.selectedElement,
      position: { x: evt.pageX, y: evt.pageY }
    });
  };

  const clearSelection = () => {
    props.clearSelection();
  };

  return (
    <div style={{ height: "100%" }}>
      <svg id="svg" width="100%" height="100%">
        <Grid
          offsetX={props.boardView.viewX}
          offsetY={props.boardView.viewY}
          onDoubleClick={addDraw}
          onClick={clearSelection}
        />
        <g
          transform={`translate(${props.boardView.viewX},${props.boardView.viewY})`}
        >
          {drawConnectors()}
          {drawDraws()}
        </g>
      </svg>
    </div>
  );
};

const mapDispatchToProps = {
  addDraw: drawActions.addDraw,
  clearSelection: drawActions.clearSelection
};

const mapStateToProps = state => ({
  boardView: state.boardView,
  showSequence: state.elements.boardDrawShowOrder,
  elements: state.elements,
  selectedElement: state.toolboxElements.elementSelected
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
