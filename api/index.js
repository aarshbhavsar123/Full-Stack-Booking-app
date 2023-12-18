const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");
const fs = require("fs");

require("dotenv").config();

const app = express();
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const port = 4000;
const bcryptSalt = bcrypt.genSaltSync(10);
const secret = "hwre8bds9f5hwiuesdhfi5uchersd4izxhf";

app.use(express.json());
app.use(cookieParser());
app.use(
  "/uploads",
  express.static(
    "C:\\Users\\baars\\OneDrive\\Desktop\\Project\\AirBNBClone\\api\\uploads"
  )
);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      "C:\\Users\\baars\\OneDrive\\Desktop\\Project\\AirBNBClone\\api\\uploads"
    );
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});
const placeAssociations = new Map();
mongoose.connect(process.env.MONGO_URL);

app.post("/register", async (req, res) => {
  const { email, name, password, confirmPass } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const userDoc = await User.create({
      email,
      name,
      password: hashedPassword,
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userDoc = await User.findOne({ email: email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { name: userDoc.name, email: userDoc.email, id: userDoc._id },
        secret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("Pass Not Ok");
    }
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, secret, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
});

app.get("/places/:action",async (req,res)=>{
  const {action} = req.params;
  res.json(await Place.findById(action));
})

app.get("/getPlaces", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, secret, {}, async (err, user) => {
        if (err) throw err;
        const places = await Place.find({ owner: user.id });
        res.json(places)
      });
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload", upload.single("file"), (req, res) => {
  const uploadedImage = req.file.filename;
  res.send(uploadedImage);
});

app.get("/getUploads", async (req, res) => {
  try {
    const uploads = await fs.promises.readdir(
      "C:\\Users\\baars\\OneDrive\\Desktop\\Project\\AirBNBClone\\api\\uploads"
    );
    res.json(uploads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, user) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: user.id,
      title: req.body.title,
      address: req.body.address,
      photos: req.body.uploadedImages,
      description: req.body.description,
      perks: req.body.perks,
      extraInfo: req.body.extraInfo,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      maxGuests: req.body.maxGuests,
      price:req.body.price
    });
    res.json(placeDoc);
  });
});
app.put("/places/:action",async (req,res)=>{
  const {action} = req.params;
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, user) => {
    if (err) throw err;
    const placeDoc = await Place.updateOne({_id:action,owner:user.id},{
      title: req.body.title,
      address: req.body.address,
      photos: req.body.uploadedImages,
      description: req.body.description,
      perks: req.body.perks,
      extraInfo: req.body.extraInfo,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      maxGuests: req.body.maxGuests,
      price:req.body.price
    });
    res.json(placeDoc);
  });
})
app.get("/getAllPlaces",async(req,res)=>{
  try {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, secret, {}, async (err, user) => {
        if (err) throw err;
        const places = await Place.find({ owner: {$ne: user.id} });
        res.json(places)
      });
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).send("Internal Server Error");
  }
})
app.listen(port, () => {
  console.log("Server running on port " + `${port}`);
});
