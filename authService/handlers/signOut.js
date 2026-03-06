const {
  CognitoIdentityProviderClient,
  GlobalSignOutCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({ region: "ap-south-1" });

exports.signOut = async (event) => {
  const { accessToken } = JSON.parse(event.body);

  const params = {
    AccessToken: accessToken,
  };
  try {
    const command = new GlobalSignOutCommand(params);
    await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ msg: "User successfully signed out." }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unexpected error.",
        details: error.message,
      }),
    };
  }
};
