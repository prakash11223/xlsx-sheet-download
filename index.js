const express = require("express");
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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/", "uploads/"));
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.originalname);
  },
});

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

app.get("/", (req, res) => {
  res.render("index");
});

app.post(
  "/api/v1/xlsx/upload",
  upload.single("file"),
  uploadController.uploadXlsx
);

app.all("*", (req, res) => {
  res.status(404).json({
    mesg: "route not defined",
  });
});

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});
