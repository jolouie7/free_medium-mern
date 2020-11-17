// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const AWS = require("aws-sdk");
// const fs = require("fs");
// const {v4 : uuidv4} = require('uuid');
// const auth = require("../../middleware/auth");
// const User = require("../../models/User");

// const s3 = new AWS.S3({
//   credentials: {
//     accessKeyId: process.env.AWS_ID,
//     secretAccessKey: process.env.AWS_SECRET,
//   },
// });

// const storage = multer.memoryStorage({
//   destination: function (req, file, callback) {
//     callback(null, "");
//   },
// });

// const upload = multer({ storage }).single("image");

// // @route PUT api/upload
// // @desc Allows the current user to upload an image
// // @access Private
// router.post("/", upload, auth, (req, res) => {
//   console.log(req.body)
//   console.log(req.file)
//   // console.log(req.params.id)
//   let myFile = req.body.image.split(".");
//   const fileType = myFile[myFile.length - 1];

//   // ! need to convert the req into a buffer to pass into the body
//   // const bufferOriginal = Buffer.from(req.body);
//   // const path = req.body.image;
//   // const buffer = fs.readFileSync(path);

//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `${req.body.image.split(".")[0] + uuidv4().slice(0, 10)}.${fileType}`,
//     Body: buffer,
//   };

//   s3.upload(params, (error, data) => {
//     if (error) {
//       res.status(500).json({error: error});
//     }
//     console.log(data.Location)
//     User.findByIdAndUpdate(req.body.id, {image: data.Location}, {new: true}).exec((err, response) => {
//       if (err) return res.status(400).json({error: err})
//       res.json(response);
//     })
//     // res.json(data)
//   });
// });

// module.exports = router;