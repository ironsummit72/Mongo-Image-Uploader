const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
var MongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const port = 800;
var url = "mongodb://localhost:27017/";
const dir = './uploads';

const app = express();
var imgpaths=[]; 
    var item='';
// this is multer a bridge between file uploads


// checking if uploads folder exists
if (fs.existsSync(dir)) {
  console.log('Directory exists!');
} else {
  console.log('Directory not found.');
  fs.mkdirSync(dir)
}

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

// connection with the database

mongoose.connect("mongodb://localhost:27017/mongo-img");
var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("connection succeeded");
});



// using body parser
app.use(bodyParser.urlencoded({ extended: true }));
// setting view engine
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,'public')));
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {

   //reciving data from database

   MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mongo-img"); //database name
    dbo
      .collection("imgcol")  //collection name
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;

        for (var i = 0; i < result.length; i++) {
          console.log(result[i].PATH);
          item = result[i].PATH;
          imgpaths[i] = item;
        }

        db.close();
      });
  });

 res.render("index", {Imagepath:imgpaths})
});

app.get("/upload", (req, res) => {

  res.render("upload");

});
app.post("/upload",upload.single('uploadimg'), (req, res) => {
  console.log(req.file); 

  let path=req.file.path; 
  let filename=req.file.filename;
  

  
  // inserting data into the database

  let schema = { Filename: filename,PATH: path };
  db.collection("imgcol").insertOne(schema, function (err, collection) {
    if (err) throw err;
    console.log("record insert successfully");
  });
  
  res.render('uploadsuccess')


})




app.post("/", (req, res) => {});

app.listen(port, function () {
  console.log(`listening on ${port}`);
});
