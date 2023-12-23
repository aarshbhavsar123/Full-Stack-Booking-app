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
const Booking = require("./models/Booking.js");
const port = 4000;
const bcryptSalt = bcrypt.genSaltSync(10);

app.use(express.json());
app.use(cookieParser());
app.use(
  "/uploads",
  express.static(
    "C:\\Users\\baars\\Downloads\\Full-Stack-Booking-app-master\\api\\uploads"
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
      "C:\\Users\\baars\\Downloads\\Full-Stack-Booking-app-master\\api\\uploads"
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
        process.env.SECRET,
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
    res.status(404).json({ error: "User not found" });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
});

app.get("/places/:action", async (req, res) => {
  const { action } = req.params;
  res.json(await Place.findById(action));
});

app.get("/getPlaces", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, process.env.SECRET, {}, async (err, user) => {
        if (err) throw err;
        const places = await Place.find({ owner: user.id });
        res.json(places);
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
      "C:\\Users\\baars\\Downloads\\Full-Stack-Booking-app-master\\api\\uploads"
    );
    res.json(uploads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.SECRET, {}, async (err, user) => {
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
      price: req.body.price,
    });
    res.json(placeDoc);
  });
});
app.put("/places/:action", async (req, res) => {
  const { action } = req.params;
  const { token } = req.cookies;
  jwt.verify(token, process.env.SECRET, {}, async (err, user) => {
    if (err) throw err;
    const placeDoc = await Place.updateOne(
      { _id: action, owner: user.id },
      {
        title: req.body.title,
        address: req.body.address,
        photos: req.body.uploadedImages,
        description: req.body.description,
        perks: req.body.perks,
        extraInfo: req.body.extraInfo,
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        maxGuests: req.body.maxGuests,
        price: req.body.price,
      }
    );
    res.json(placeDoc);
  });
});
app.get("/getAllPlaces", async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/booking/:id", async (req, res) => {
  const { id } = req.params;
  const {
    place,
    checkInDate,
    checkOutDate,
    guests,
    name,
    phone,
    price,
    daysDifference,
  } = req.body;
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.SECRET, {}, async (err, user) => {
      if (err) throw err;
      const existingBooking = await Booking.findOne({
        place: id,
        $or: [
          {
            checkInDate: { $lt: req.body.checkOutDate },
            checkOutDate: { $gt: req.body.checkInDate },
          },
          {
            checkInDate: {
              $gte: req.body.checkInDate,
              $lt: req.body.checkOutDate,
            },
          },
          {
            checkOutDate: {
              $gt: req.body.checkInDate,
              $lte: req.body.checkOutDate,
            },
          },
        ],
      });
      const placeWithID = await Place.findById(id)
      if (!existingBooking && user.id !== placeWithID.owner) {
        const placeDoc = await Booking.create({
          place: id,
          user: user.id,
          checkInDate: req.body.checkInDate,
          checkOutDate: req.body.checkOutDate,
          guests: req.body.guests,
          name: req.body.name,
          phone: req.body.phone,
          totalPrice: req.body.price * req.body.daysDifference,
        });
        res.status(200).json({ message: "Booking created successfully" });
      } else {
        res.status(409).json({
          message: "Booking date range conflicts with an existing booking",
        });
      }
    });
  } else {
    res.status(401).send("Unauthorized");
  }
});
app.get("/getBookedPlace", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, process.env.SECRET, {}, async (err, user) => {
        if (err) throw err;
        const bookedPlaces = await Booking.find({ user: user.id }).populate("place");
        res.json(bookedPlaces);
      });
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.listen(port, () => {
  console.log("Server running on port " + `${port}`);
});
