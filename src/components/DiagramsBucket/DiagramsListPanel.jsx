import React from "react";
import { Link, useNavigate } from "@reach/router";
import { getUserDiagrams } from "../../comunication/diagramsController";
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
    console.log("recreating");
    fillDiagrams();
  }, []);

  const [diagrams, setDiagrams] = useState([]);

  const fillDiagrams = () => {
    getUserDiagrams().then((a) => {
      setDiagrams(a);
    });
  };

  const getDummieSlots = () => {
    const dummiesCount =
      diagrams.length >= 8
        ? (diagrams.length + 1) % 3 === 0
          ? 0
          : 3 - ((diagrams.length + 1) % 3)
        : 8 - diagrams.length;
    let dummieSlots = [];

    for (let i = 0; i < dummiesCount; i++) {
      dummieSlots.push(<Slot key={"dummie" + i}></Slot>);
    }
    return dummieSlots;
  };

  return (
    <DiagramsListStyled>
      <Slot>
        <ButtonCreate onCreate={fillDiagrams}></ButtonCreate>
      </Slot>
      {diagrams &&
        diagrams
          .sort((a, b) => {
            return a.createdAt > b.createdAt ? 1 : -1;
          })
          .map((item) => (
            <Slot key={item.id}>
              <DiagramCard name={item.name} boardId={item.id}></DiagramCard>
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
