const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const port = 80;

const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-'+file.originalname)
  }
})

const upload = multer({ storage: storage })
// using body parser
app.use(bodyParser.urlencoded({ extended: true }));
// setting view engine
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,'public')));

app.get("/", (req, res) => {
 res.render("index", {title:"sumit"})
});

app.get("/upload", (req, res) => {

  res.render("upload")
});
app.post("/upload",upload.single('uploadimg'), (req, res) => {
  console.log(req.file);

})




app.post("/", (req, res) => {});

app.listen(port, function () {
  console.log(`listening on ${port}`);
});
