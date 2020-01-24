import React from "react";
import { connect } from "react-redux";
import Grid from "../components/Grid.jsx";
import * as elementTypes from "../types/ElementTypes";

import DrawWraper from "./DrawWrapper.jsx";
import Line from "../components/Line.jsx";

const Board = props => {
  const moving = (conId, where, x, y) => {
    let connectorRef = props.elements.connectors.find(con => con.id == conId);
    console.log(where);
    connectorRef[where].x = x;
    connectorRef[where].y = y;
    connectorRef[where].update();
  };

  return (
    <div style={{ height: "100%" }}>
      <svg id="svg" width="100%" height="100%">
        <Grid offsetX={props.boardView.viewX} offsetY={props.boardView.viewY} />
        <g
          transform={`translate(${props.boardView.viewX},${props.boardView.viewY})`}
        >
          {props.elements.connectors.map(con => (
            <Line from={con.from} to={con.to} />
          ))}
          {props.elements.draws.map(item => (
            <DrawWraper {...item} moving={moving} />
          ))}
        </g>
      </svg>
    </div>
  );
};

const mapDispatchToProps = {};

const mapStateToProps = state => ({
  boardView: state.boardView,
  elements: state.elements
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
