import React from "react";
import GridLoader from "react-spinners/GridLoader";
import styled from "styled-components";

const StyledDivLoadingAllView = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
`;

const BoardLoader = (props) => {
  return (
    <StyledDivLoadingAllView>
      <GridLoader size={40} color={"rgb(183,180,77)"} loading={true} />
    </StyledDivLoadingAllView>
  );
};

export default BoardLoader;
