export default {
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    // identityPoolId: "ca-central-1:939160791080:userpool/ca-central-1_tZYpSS5Iw",

    // REQUIRED - Amazon Cognito Region
    // region: "ca-central-1",

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "hdtv6o84pcl1ufhl68a5o5tdp",

    userPoolId: "ca-central-1_Xgo81D3bx",

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    // mandatorySignIn: false,

    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    cookieStorage: {
      // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      domain: "diagrammer.auth.ca-central-1.amazoncognito.com",
      secure: false,
    },

    // // OPTIONAL - Hosted UI configuration
    // oauth: {
    //   domain: "your_cognito_domain",
    //   scope: [
    //     "phone",
    //     "email",
    //     "profile",
    //     "openid",
    //     "aws.cognito.signin.user.admin",
    //   ],
    //   redirectSignIn: "http://localhost:3000/",
    //   redirectSignOut: "http://localhost:3000/",
    //   responseType: "code", // or 'token', note that REFRESH token will only be generated when the responseType is code
    // },
  },
};

// You can get the current config object
