import React from "react";
import styled from "styled-components";
import PropagateLoader from "react-spinners/PropagateLoader";

const buttonWithAwaiter = (WrappedComponent) => {
  return (props) => {
    if (props.waiting)
      return (
        <WrappedComponent {...props}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "3.3em",
              opacity: "0.5",
              cursor: "auto",
            }}
          >
            <PropagateLoader size={14} color={"white"} loading={true} />
          </div>
        </WrappedComponent>
      );
    else return <WrappedComponent {...props} />;
  };
};

const BaseButton = styled.button`
  font-size: large;
  padding: 0.3rem;
  margin: 0.5rem;
  border: solid 1px #8e4242;
  border-radius: 0.2rem;
`;

export const GoldButton = styled(BaseButton)`
  background-color: rgb(183, 180, 77);
  border-color: rgb(160, 158, 82);
`;

export const RedButton = buttonWithAwaiter(styled(BaseButton)`
  background-color: rgb(195, 75, 75);
  border-color: #8e4242;
`);
