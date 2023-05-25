module.exports.handler = async (event, context) => {
  console.log("Second function called.");

  return {
    statusCode: 200
  }
};