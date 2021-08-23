const AWS = require("aws-sdk");
const axios = require("axios");

// Name of a service, any string
const serviceName = process.env.SERVICE_NAME;
// URL of a service to test
const url = process.env.URL;

// CloudWatch client
const cloudwatch = new AWS.CloudWatch();

exports.handler = async (event) => {
  // TODO: Use these variables to record metric values
  let endTime;
  let requestWasSuccessful;

  try {
    const startTime = timeInMs();
    await axios.get(url);
    const endTime = timeInMs();

    const timeDiff = endTime - startTime;
    // Example of how to write a single data point
    await cloudwatch
      .putMetricData({
        MetricData: [
          {
            MetricName: "Latency", // Use different metric names for different values, e.g. 'Latency' and 'Successful'
            Dimensions: [
              {
                Name: "ServiceName",
                Value: serviceName,
              },
            ],
            Unit: "Milliseconds", // 'Count' or 'Milliseconds'
            Value: timeDiff, // Total value
          },
        ],
        Namespace: "Nitesh/Serveless",
      })
      .promise();

    const response = {
      statusCode: 200,
      body: JSON.stringify("Success!"),
    };
    return response;
  } catch (error) {
    const response = {
      statusCode: 400,
      body: JSON.stringify("Failed!"),
    };
    return response;
  }

  // TODO: Record time it took to get a response
  // TODO: Record if a response was successful or not
};

function timeInMs() {
  return new Date().getTime();
}
