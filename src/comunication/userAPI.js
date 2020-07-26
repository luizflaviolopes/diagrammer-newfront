import { Auth } from "aws-amplify";

const getUserToken = async (callback) => {
  let session = await Auth.currentSession();
  return session.getIdToken().getJwtToken();
};

export default { getUserToken };
