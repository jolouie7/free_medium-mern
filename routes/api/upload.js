const express = require("express");
const router = express.Router();
const multer = require("multer");
const AWS = require("aws-sdk");
const {v4 : uuidv4} = require('uuid')

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

const upload = multer({ storage }).single("image");

router.post("/", upload, (req, res) => {
  let myFile = req.file.originalname.split(".");
  const fileType = myFile[myFile.length - 1];

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${req.file.originalname.split(".")[0] + uuidv4().slice(0,10)}.${fileType}`,
    Body: req.file.buffer,
  };

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).json({error: error});
    }

    res.json(data)
  });
});

module.exports = router;