const express = require("express");
const router = express.Router();
const upload = require("./upload")
const singleUpload = upload.single("image");
const User = require("../../models/User");

router.post("/:id", (req, res) => {
  const uid = req.params.id;

  singleUpload(req, res, function (err) {
    if (err) {
      return res.json({
        success: false,
        errors: {
          title: "Image Upload Error",
          detail: err.message,
          error: err,
        },
      });
    }

    // console.log(req.file)
    let update = { image: req.file.location };

    User.findByIdAndUpdate(uid, update, { new: true }).exec((err ,response) => {
      if (err) return res.status(400).json({error: err})
      res.json(response)
    })
  });
});

module.exports = router;