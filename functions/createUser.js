const { createUserInCognito } = require("../lib/cognito/AdminCreateUser");

module.exports.handler = async (event) => {
    console.log("Event :", event)
    const body = JSON.parse(event.body);
    const { dealerId } = event.requestContext.authorizer;

    try {

        await createUserInCognito({ ...body, dealerId });
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "SUCCESS" })
        }
    } catch (error) {
        return {
            statusCode: 409,
            body: JSON.stringify({ message: error.message })
        }
    }
}
