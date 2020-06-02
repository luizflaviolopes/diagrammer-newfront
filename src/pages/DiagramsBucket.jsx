import React from "react";
import DiagramsListPanel from "../components/DiagramsBucket/DiagramsListPanel.jsx";
import MeuLeft from "../components/DiagramsBucket/MenuLeft.jsx";

const DiagramsBucket = (props) => {
  return (
    <React.Fragment>
      <MeuLeft></MeuLeft>
      <DiagramsListPanel></DiagramsListPanel>
    </React.Fragment>
  );
};

export default DiagramsBucket;
