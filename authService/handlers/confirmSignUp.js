const {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({ region: "ap-south-1" });

const CLIENT_ID = "b4h0mpt6t1anrl7e9fkuhs5if";

exports.confirmSignUp = async (event) => {
  const { email, confirmationCode } = JSON.parse(event.body);
  const params = {
    ClientId: CLIENT_ID,
    Username: email,
    ConfirmationCode: confirmationCode,
  };

  try {
    const command = new ConfirmSignUpCommand(params);
    await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: "User confirmed successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: "Failed to confirm user signup",
        error: error.message,
      }),
    };
  }
};
