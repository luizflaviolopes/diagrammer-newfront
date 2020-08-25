import React from "react";
import elementTypeResolver from "../helpers/elementTypeResolver";

//props.drawType -> tipo desenho a ser utilizado
class DrawAdapter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightConnectorDrawing: false,
      highlightDrawDragging: false,
    };
  }

  onDragOver = (evt) => {
    if (this.props.connectorDrawing) {
      this.setState({ highlightConnectorDrawing: true });
    } else if (this.props.onDragging && !this.props.selected) {
      this.setState({ highlightDrawDragging: true });
    }
  };

  onDragOut = (evt) => {
    if (this.state.highlightConnectorDrawing) {
      this.setState({ highlightConnectorDrawing: false });
    }
    if (this.state.highlightDrawDragging) {
      this.setState({ highlightDrawDragging: false });
    }
  };

  calcPointerEvents = () => {
    if (this.props.onDragging && this.props.selected) return "none";
    else return "painted";
  };

  render() {
    const pointerEvents = this.calcPointerEvents();
    const Element = elementTypeResolver(this.props.type);

    let fillProperties = {};
    let strokeProperties = {};

    if (this.state.highlightConnectorDrawing) {
      fillProperties = {
        fill: "rgb(182, 212, 239)",
      };
    } else if (this.state.highlightDrawDragging)
      fillProperties = {
        fill: "rgb(243, 183, 183)",
      };
    else if (this.props.selected) {
      fillProperties = {
        opacity: "0.7",
      };
      strokeProperties = {
        opacity: "1",
        stroke: "black",
        strokeWidth: "3",
        //strokeDasharray: 6,
      };
    }

    return (
      <g onMouseOver={this.onDragOver} onMouseOut={this.onDragOut}>
        <Element
          text={this.props.text}
          height={this.props.height}
          width={this.props.width}
          radius={this.props.radius}
          selected={this.props.selected}
          id={this.props.id}
          pointerEvents={pointerEvents}
          strokeProperties={strokeProperties}
          fillProperties={fillProperties}
        ></Element>
      </g>
    );
  }
}

export default DrawAdapter;
