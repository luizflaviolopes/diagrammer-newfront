import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import Grid from "../components/Grid.jsx";
import * as drawActions from "../actions/drawing";

import draggingAPI from "../Listeners/mouse/draggingAPI";
import keyboardAPI from "../Listeners/keyboard/keyboardAPI";

import DrawWraper from "./DrawWrapper.jsx";
import Connector from "./Connector.jsx";
import Marker from "../components/Markers.jsx";
import SelectedDraws from "./SelectedDraws.jsx";

const Board = (props) => {
  useEffect(() => {
    draggingAPI.startDrag();
    keyboardAPI.start();
    return () => {
      draggingAPI.endDrag();
      keyboardAPI.stop();
    };
  }, []);

  const drawconnectors = () => {
    return Object.keys(props.connectors).map((conn) => {
      return <Connector key={conn} id={conn} />;
    });
  };

  const drawDraws = (list) => {
    return list.map((itemId) => {
      //console.log("rendering", itemId);
      return <DrawWraper key={itemId} id={itemId} />;
    });
  };

  const addDraw = (evt) => {
    props.addDraw({
      type: props.selectedElement,
      position: { x: evt.pageX, y: evt.pageY },
    });
  };

  const clearSelection = () => {
    props.clearSelection();
  };
  //console.log("renderBoard");
  return (
    <div style={{ height: "100%" }}>
      <svg id="svg" width="100%" height="100%">
        <Marker />
        <Grid
          offsetX={props.boardView.x}
          offsetY={props.boardView.y}
          onDoubleClick={addDraw}
          onClick={clearSelection}
        />
        <g
          transform={`matrix(${props.boardView.zoom},0,0,${props.boardView.zoom},${props.boardView.x},${props.boardView.y})`}
        >
          {drawDraws(props.showSequence)}
          {drawconnectors()}
          <SelectedDraws />
        </g>
      </svg>
    </div>
  );
};

const mapDispatchToProps = {
  addDraw: drawActions.addDraw,
  clearSelection: drawActions.clearSelection,
};

const mapStateToProps = (state) => ({
  boardView: state.elements.boardView,
  showSequence: state.elements.boardDrawShowOrder,
  selectedDraws: state.elements.sessionState.drawsSelected,
  selectedElement: state.elements.drawListBoxSelection,
  connectors: state.elements.connectors,
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
