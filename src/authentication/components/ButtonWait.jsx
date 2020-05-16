import React from "react";
import PropagateLoader from "react-spinners/PropagateLoader";

const ButtonWait = (props) => {
  return (
    <button
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "3.3em",
        opacity: props.wait ? "0.5" : undefined,
        cursor: props.wait ? "auto" : undefined,
      }}
      // onClick={handleRegistration}
      disabled={props.wait}
    >
      {props.wait ? (
        <PropagateLoader size={14} color={"white"} loading={true} />
      ) : (
        props.text
      )}
    </button>
  );
};

export default ButtonWait;
