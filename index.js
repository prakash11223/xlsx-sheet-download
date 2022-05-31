const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const uploadController = require("./uploadController");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));

//set up for view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//defining storage options for multer to store files
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/", "uploads/"));
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.originalname);
  },
});

// upload function to upload the input file
var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    //check if extension is not xlsx then error
    if (ext != ".xlsx") {
      return callback(new Error("You can upload only xlsx Files"));
    }
    callback(null, true);
  },
});

// hompage to get simple html form for uploading thre file
app.get("/", (req, res) => {
  res.render("index");
});

// making a post request to upload the the file and then updating it and the returning to user
app.post(
  "/api/v1/xlsx/upload",
  upload.single("file"),
  uploadController.uploadXlsx
);

// any other route is not defined
app.all("*", (req, res) => {
  res.status(404).json({
    mesg: "route not defined",
  });
});

// starting the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server Started at ${3000}`);
});
