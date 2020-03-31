export const delPressed = state => {};

const deleteConnectors = state => {
  export const clearConnectorSelection = state => {
    const connectors = { ...state.connectors };

    for (let i = 0; i < state.sessionState.connectorSelected.length; i++) {
      const conn = connectors[state.sessionState.connectorSelected[i]];

      state.draws[conn.endPoints[0].id];

      delete connectors[state.sessionState.connectorSelected[i]];
    }

    state.sessionState.connectorSelected = [];
  };
};
