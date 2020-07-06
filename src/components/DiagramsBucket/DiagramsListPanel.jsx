import React from "react";
import { Auth } from "aws-amplify";
import { Link, useNavigate } from "@reach/router";
import conf from "../../config.js";
import api from "../../tools/api.js";
import Slot from "./Slot.jsx";
import styled from "styled-components";
import ButtonCreate from "./ButtonCreate.jsx";
import { useEffect } from "react";
import { useState } from "react";
import ContentLoader from "react-content-loader";
import DiagramCard from "./DiagramCard.jsx";

const DiagramsListStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  top: 20px;
  right: 10px;
  left: 100px;
  bottom: 10px;
`;

const DiagramsListPanel = (props) => {
  useEffect(() => {
    fillDiagrams();
  });

  const [diagrams, setDiagrams] = useState([]);

  const fillDiagrams = () => {
    api.get("diagrams").then((a) => {
      setDiagrams(a);
    });
  };

  const getDummieSlots = () => {
    if (diagrams.length >= 8) return null;

    let dummieSlots = [];
    for (let i = diagrams.length; i < 8; i++) {
      dummieSlots.push(<Slot key={"dummie" + i}></Slot>);
    }
    return dummieSlots;
  };

  return (
    <DiagramsListStyled>
      <Slot>
        <ButtonCreate></ButtonCreate>
      </Slot>
      {diagrams &&
        diagrams.map((item) => (
          <Slot key={item.id}>
            <DiagramCard name={item.id}></DiagramCard>
          </Slot>
        ))}
      {getDummieSlots()}
    </DiagramsListStyled>
  );
};

const DiagramLoader = (props) => (
  <ContentLoader
    speed={2}
    width={400}
    height={160}
    viewBox="0 0 400 160"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="2" y="15" rx="0" ry="0" width="356" height="96" />
  </ContentLoader>
);

export default DiagramsListPanel;
