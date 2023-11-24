const express = require("express");
const {
  createTranscript,
  convertTomp3,
  createSummary,
  createFileTranscript,
} = require("../controller/transcribeController");
const multer = require("multer");

// Set up multer for handling file uploads and saving to disk
const storage = multer.diskStorage({
  destination: "./uploads", // Specify the directory to save files
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.route("/create").post(
  upload.single("file"),
  (req, res, next) => {
    // Check if a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Log the information about the uploaded file
    console.log("Uploaded file:", req.file);

    // Call the next middleware (createTranscript) only if the file is uploaded successfully
    next();
  },
  createTranscript
);
router.route("/filecreate").post(
  upload.single("file"),
  (req, res, next) => {
    // Check if a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Log the information about the uploaded file
    console.log("Uploaded file:", req.file);

    // Call the next middleware (createTranscript) only if the file is uploaded successfully
    next();
  },
  createFileTranscript
);
router.route("/convert").post(convertTomp3);
router.route("/notes").post(createSummary);

module.exports = router;
