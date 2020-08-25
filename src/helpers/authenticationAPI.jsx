import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from "amazon-cognito-identity-js";
import { values } from "d3";

var cognitoUser;

var poolData = {
  UserPoolId: "ca-central-1_tZYpSS5Iw", // Your user pool id here
  ClientId: "59ho6afphqb29bqd5f1du37e13", // Your client id here
};

var userPool = new CognitoUserPool(poolData);

const propertyPatterns = [
  {
    property: "password",
    message:
      "A senha deve conter pelo menos 8 caracteres e dentre eles uma letra maiúscula, um caractere especial e um número",
  },
];

export const registerUser = async (name, password, email, celphone) => {
  var attributeList = [];

  // var dataEmail = {
  //   Name: "email",
  //   Value: email,
  // };

  var dataName = {
    Name: "name",
    Value: name,
  };

  // var dataPhoneNumber = {
  //   Name: "phone_number",
  //   Value: "+5531987370700",
  // };
  // var attributeEmail = new CognitoUserAttribute(dataEmail);
  var attributeName = new CognitoUserAttribute(dataName);
  // var attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);

  // attributeList.push(attributeEmail);
  // attributeList.push(attributePhoneNumber);
  attributeList.push(attributeName);

  var res;
  userPool.signUp(email, password, attributeList, null, function (err, result) {
    if (err) {
      // if (err.code == "InvalidParameterException") {
      //   let errorsToReturn = {};
      //   let errorsList = err.message.split(';');

      //   for(let i = 1;i < errorsList.length; i++)
      //   {
      //     let prop = errorsList[i].match(/Value at '(.*)'/g);
      //     errorsToReturn[prop] = [...]
      //   }

      //   return;
      // } else {
      res = { err: err };
      return;
      // }
    }

    cognitoUser = result.user;
    //console.log("user name is " + cognitoUser.getUsername());
    //console.log(cognitoUser);
    res = { status: "ok" };
  });

  while (!res) {
    await new Promise((r) => setTimeout(r, 50));
  }

  return res;
};

export const confirmUser = (code) => {
  cognitoUser.confirmRegistration(code, true, function (err, result) {
    if (err) {
      alert(err);
      return;
    }
    //console.log("call result: " + result);
  });
};
