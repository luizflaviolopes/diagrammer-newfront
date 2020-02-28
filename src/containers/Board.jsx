import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import Grid from "../components/Grid.jsx";
import * as drawActions from "../actions/drawing";

import draggingAPI from "../helpers/draggingAPI/draggingAPI";

import DrawWraper from "./DrawWrapper.jsx";
import Line from "../components/Line.jsx";
import Connector from "./Connector.jsx";

const Board = props => {
  useEffect(() => {
    draggingAPI.startDrag();
    return draggingAPI.endDrag;
  }, []);

  const drawProvisoryConnector = () => {
    if (props.drawingConnector)
      return (
        <Connector
          key={props.drawingConnector}
          id={props.drawingConnector}
          prov
        />
      );
    else return null;
  };

  const drawDraws = list => {
    return list.map(itemId => {
      console.log("rendering", itemId);
      return <DrawWraper key={itemId} id={itemId} />;
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
          {drawDraws(props.showSequence)}
          {drawDraws(props.selectedDraws)}
          {drawProvisoryConnector()}
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
  selectedDraws: state.elements.sessionState.elementsSelected,
  selectedElement: state.toolboxElements.elementSelected,
  drawingConnector: state.elements.sessionState.drawingConnector
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
