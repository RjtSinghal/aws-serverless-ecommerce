const {
  CognitoIdentityProviderClient,
  SignUpCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({ region: "ap-south-1" });
const UserModel = require("../models/userModel");

const CLIENT_ID = process.env.CLIENT_ID;

exports.signUp = async (event) => {
  const { email, fullName, password } = JSON.parse(event.body);

  const params = {
    ClientId: CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: "name", Value: fullName },
      { Name: "email", Value: email },
    ],
  };

  try {
    const command = new SignUpCommand(params);
    await client.send(command);

    // Save user details in DynamoDB
    const newUser = new UserModel(email, fullName);
    await newUser.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: "Account created successfully. Please enter the otp that was sent to your email.",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: "Internal Server Error",
        error: error.message,
      }),
    };
  }
};
