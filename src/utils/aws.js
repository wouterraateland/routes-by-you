import AWS from "aws-sdk";

AWS.config.update({
  region: "eu-central-1",
});

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_BUCKET_ACCESS_KEY_SECRET,
});
