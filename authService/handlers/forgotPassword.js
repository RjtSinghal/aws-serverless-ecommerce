const {
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({ region: "ap-south-1" });

const CLIENT_ID = process.env.CLIENT_ID;

exports.forgotPassword = async (event) => {
  const { email } = JSON.parse(event.body);
  const params = {
    ClientId: CLIENT_ID,
    Username: email,
  };
  try {
    const command = new ForgotPasswordCommand(params);
    await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: "Password reset initiated. Check your email for confirmation code.",
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: "Password reset failed.",
        error: error.message,
      }),
    };
  }
};
