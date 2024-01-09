const express = require("express");
const cors = require("cors");
const path = require("path");
var jwt = require("jsonwebtoken");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const bodyParser = require("body-parser");
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 4002;

const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://abhishekkumar62557:aCXAUmmlREaieUmT@cluster0.en8ws5y.mongodb.net/mernstack"
);

const Users = mongoose.model("Users", {
  username: String,
  mobile: String,
  email: String,
  password: String,
  likedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }],
});

let schema = new mongoose.Schema({
  pname: String,
  pdesc: String,
  price: String,
  category: String,
  pimage: String,
  pimage2: String,
  addedBy: mongoose.Schema.Types.ObjectId,
  pLoc: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
    },
  },
});

schema.index({ pLoc: "2dsphere" });

const Products = mongoose.model("Products", schema);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/search", (req, res) => {
  console.log(req.query)
  let latitude = req.query.loc.split(',')[0]
  let longitude = req.query.loc.split(',')[1]

  let search = req.query.search;

  Products.find({
    $or: [
      { pname: { $regex: search } },
      { pdesc: { $regex: search } },
      { price: { $regex: search } },
    ],
    pLoc : {
      $near :{
        $geometry:{
          type : 'Point',
          coordinates : [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance : 500 * 1000, 
      }
    }
  })
    .then((results) => {
      res.send({ message: "success", products: results });
    })
    .catch((err) => {
      res.send({ message: "server err" });
    });
});

app.post("/like-product", (req, res) => {
  let productId = req.body.productId;
  let userId = req.body.userId;

  Users.updateOne({ _id: userId }, { $addToSet: { likedProducts: productId } })
    .then(() => {
      res.send({ message: "liked  success" });
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
});

app.post(
  "/add-product",
  upload.fields([{ name: "pimage" }, { name: "pimage2" }]),
  (req, res) => {
    console.log(req.files);
    console.log(req.body);

    const plat = req.body.plat;
    const plong = req.body.plong;
    const pname = req.body.pname;
    const pdesc = req.body.pdesc;
    const price = req.body.price;
    const category = req.body.category;
    const pimage = req.files.pimage[0].path;
    const pimage2 = req.files.pimage2[0].path;
    const addedBy = req.body.userId;

    const product = new Products({
      pname,
      pdesc,
      price,
      category,
      pimage,
      pimage2,
      addedBy,
      pLoc: { type: "Point", coordinates: [plat, plong] },
    });
    product
      .save()
      .then(() => {
        res.send({ message: "saved  success" });
      })
      .catch(() => {
        res.send({ message: "server error" });
      });
  }
);

app.get("/get-products", (req, res) => {
  const catName = req.query.catName;

  let _f = {};
  if (catName) {
    _f = { category: catName };
  }

  Products.find(_f)
    .then((result) => {
      res.send({ message: "success", products: result });
    })
    .catch((err) => {
      res.send({ message: "server err" });
    });
});

app.get("/get-product/:pId", (req, res) => {
  console.log(req.params);

  Products.findOne({ _id: req.params.pId })
    .then((result) => {
      res.send({ message: "success", product: result });
    })
    .catch((err) => {
      res.send({ message: "server err" });
    });
});

app.post("/liked-products", (req, res) => {
  Users.findOne({ _id: req.body.userId })
    .populate("likedProducts")
    .then((result) => {
      res.send({ message: "success", products: result.likedProducts });
    })
    .catch((err) => {
      res.send({ message: "server err" });
    });
});


app.post("/my-products", (req, res) => {
  const userId = req.body.userId;
  Products.find({addedBy: userId})
    .then((result) => {
      res.send({ message: "success", products: result });
    })
    .catch((err) => {
      res.send({ message: "server err" });
    });
});

//signup api
app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const user = new Users({
    username: username,
    password: password,
    email,
    mobile,
  });
  user
    .save()
    .then(() => {
      res.send({ message: "saved  success" });
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
});


app.get('/my-profile/:userId',(req,res)=>{
  let uid = req.params.userId

  Users.findOne({_id:uid})
  .then((result) => {
    res.send({
      message: "success",
      user: {
        email: result.email,
        mobile: result.mobile,
        username: result.username,
      },
    });
  })
  .catch(() => {
    res.send({ message: "server error" });
  });
  return;
})

app.get("/get-user/:uId", (req, res) => {
  const _userId = req.params.uId;
  Users.findOne({ _id: _userId })
    .then((result) => {
      res.send({
        message: "success",
        user: {
          email: result.email,
          mobile: result.mobile,
          username: result.username,
        },
      });
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
});

//login api
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  Users.findOne({ username: username })
    .then((result) => {
      if (!result) {
        res.send({ message: "user not found." });
      } else {
        if (result.password == password) {
          const token = jwt.sign(
            {
              data: result,
            },
            "MYKEY",
            { expiresIn: 60 * 60 }
          );

          res.send({
            message: "find  success",
            token: token,
            userId: result._id,
          });
        }
        if (result.password != password) {
          res.send({ message: "wrong password" });
        }
      }
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
