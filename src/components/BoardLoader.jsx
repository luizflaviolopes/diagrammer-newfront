import React from "react";
import GridLoader from "react-spinners/GridLoader";

const BoardLoader = (props) => {
  return (
    <div>
      <GridLoader size={14} color={"gold"} loading={true} />
    </div>
  );
};

export default BoardLoader;
