import React from "react";
import styled from "styled-components";
import BeatLoader from "react-spinners/BeatLoader";

const buttonWithAwaiter = (WrappedComponent) => {
  return (props) => {
    if (props.waiting)
      return (
        <WrappedComponent {...props}>
          <div style={{ position: "relative" }}>
            <div style={{ visibility: "hidden" }}>{props.children}</div>
            <div
              style={{
                opacity: 0.8,
                cursor: "auto",
                position: "absolute",
                top: 0,
                margin: "auto",
                width: "100%",
              }}
            >
              <BeatLoader size={14} color={"white"} loading={true} />
            </div>
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
