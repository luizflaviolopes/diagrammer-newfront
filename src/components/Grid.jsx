import { zoom } from "d3";
import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { bindMouseFunctions } from "../Listeners/mouse/mouseFunctionsBinder";

const Grid = (props) => {
  const smGridSize = 10;
  const bgGRidSize = 40;

  const zoomCorrect = props.zoom

  const gridEl = useRef(null);

  useEffect(() => {
    bindMouseFunctions(gridEl.current,{
      onClick: props.onClick,
      onDbClick: props.onDoubleClick,
      onDrag: props.onDrag
    })
  }, [])

  return (
    <React.Fragment>
      <defs>
        <pattern
          id="smallGrid"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect
            width="10"
            height="10"
            fill="none"
            stroke="#d6d6d6"
            strokeWidth="0.2"
          />
        </pattern>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect
            width="40"
            height="40"
            fill="url(#smallGrid)"
            stroke="#d6d6d6"
            strokeWidth="0.3"
          />
        </pattern>
      </defs>
      <rect
        ref={gridEl}
        transform={`matrix(1,0,0,1, ${-10 +props.offsetX % 10},${-10 +props.offsetY % 10})`}
        id="surface"
        x="0"
        y="0"
        width="200%"
        height="200%"
        fill="url(#smallGrid)"
        // onDoubleClick={props.onDoubleClick}
        // onClick={props.onClick}
        // onDrag={evt => {console.log('dragstart')}}
        // draggable='true'
      />
    </React.Fragment>
  );
};

export default Grid;
