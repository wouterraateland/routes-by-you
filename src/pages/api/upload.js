import { s3 } from "utils/aws";

export default async (req, res) => {
  const buffer = Buffer.from(
    req.body.data.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const url = await new Promise((resolve, reject) =>
    s3.upload(
      {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.body.key,
        Body: buffer,
        ACL: "public-read",
      },
      (error, data) => (error ? reject(error) : resolve(data.Location))
    )
  );

  res.status(200).json({ url });
};
