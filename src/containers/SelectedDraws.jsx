import React from "react";
import { connect } from "react-redux";
import DrawWraper from "./DrawWrapper.jsx";

const SelectedDraws = (props) => {
  return props.elements.map((itemId) => {
    return <DrawWraper key={itemId} id={itemId} />;
  });
};

const mapDispatchToProps = {};

const mapStateToProps = (state) => ({
  elements: state.elements.sessionState.drawsSelected,
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectedDraws);
