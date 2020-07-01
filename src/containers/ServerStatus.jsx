import React from "react";
import GridLoader from "react-spinners/GridLoader";
import { connect } from "react-redux";
import { GrStatusWarning } from "react-icons/gr";

const ServerNotification = (props) => {
  switch (props.status) {
    case 2: //busy
      return (
        <div className="server-notify">
          <GridLoader></GridLoader>
        </div>
      );
    case 3: //disconnected
      return (
        <div className="server-notify">
          <h1>
            <GrStatusWarning></GrStatusWarning>
          </h1>
        </div>
      );
    case 1: //ready
    case 0: //idle
    default:
      return null;
  }
};

const mapStateToProps = (state) => ({
  status: state.serverConnection.communicationStatus,
});

export default connect(mapStateToProps, null)(ServerNotification);
