const asyncHandler = require("express-async-handler");
const fs = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.WHISPER_API_KEY,
});

const createTranscript = asyncHandler(async (req, res) => {
  console.log("POST REQ at EndPoint: `/create`");
  console.log(req.file);

  const inputFilePath = `./uploads/${req.file.originalname}`;
  const outputFilePath = `./uploads/${req.file.originalname.split(".")[0]}.mp3`;

  await ffmpeg()
    .input(inputFilePath)
    .audioCodec("libmp3lame") // Use the LAME MP3 codec
    .toFormat("mp3")
    .on("end", async () => {
      // ON SUCCESSFULL CONVERSION
      console.log("Conversion finished");
      // fs.readdir("./uploads", (err, files) => {
      //   if (err) {
      //     console.error("Error reading folder:", err);
      //     return;
      //   }

      //   // Now 'files' is an array of filenames in the folder
      //   console.log("Files in the folder:", files);

      // });

      // DELETE THE ORIGINAL FILE
      fs.unlink(`./uploads/${req.file.originalname}`, (error) => {
        if (error) {
          console.log("Error Deleting File", error);
        } else {
          console.log(`File: ${req.file.originalname} Deleted Successfully`);
        }
      });

      // TRANSCRIBE THE AUDIO FILE
      const fileName = `./uploads/${req.file.originalname}`;
      console.log(`Transcribe File: .${fileName.split(".")[1]}.mp3`);
      const audioPath = `.${fileName.split(".")[1]}.mp3`;
      try {
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(audioPath),
          model: "whisper-1",
        });
        console.log(transcription.text);

        // DELETE THE CONVERTED MP3 FILE AFTER TRANSCRIPTION
        fs.unlink(audioPath, (error) => {
          if (error) {
            console.log("Error Deleting MP3 File", error);
          } else {
            console.log(`MP3 File: ${audioPath} Deleted Successfully`);
          }
        });

        res.status(201).json(transcription.text);
      } catch (error) {
        console.log(error);
        res.status(400).json("Error Transcribing the file!");
      }
    })
    .on("error", (err) => {
      console.error("Error:", err);
    })
    .save(outputFilePath);

  // res.status(201).json("API HIT!");
});

const convertTomp3 = asyncHandler(async (req, res) => {
  console.log("POST REQ at EndPoint: `/convert`");
  const inputFilePath = "harvard.wav";
  const outputFilePath = "harvard.mp3";

  ffmpeg()
    .input(inputFilePath)
    .audioCodec("libmp3lame") // Use the LAME MP3 codec
    .toFormat("mp3")
    .on("end", () => {
      console.log("Conversion finished");
    })
    .on("error", (err) => {
      console.error("Error:", err);
    })
    .save("./uploads");
});

module.exports = { createTranscript, convertTomp3 };
