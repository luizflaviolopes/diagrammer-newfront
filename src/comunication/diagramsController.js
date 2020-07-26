import api from "./connectors/restServerConnector";

export const getUserDiagrams = async () => {
  return await api.get("diagrams");
};

export const createDiagram = async (name) => {
  return await api.post("diagrams/create", { name: name });
};
