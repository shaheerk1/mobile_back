require("dotenv").config();
require("../config/database").connect();
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const app = express();

app.use(express.json());

//get user details
router.get("/get-user", auth, async (req, res) => {
  res.send({ data: "get user data" });
});

//update user details by userId
router.put("/update-user/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;
    let userData = req.body;
    //encrypt user password
    encryptPassword = await bcrypt.hash(req.body.password, 10);
    userData.password = encryptPassword;
    let updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    });
    updatedUser.password = req.body.password;
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
  }
});

//user forget password end-point
router.put("/forget-password/:email", async (req, res) => {
  try {
    
    let query = {email: req.params.email};
    //check user is already exists
    const oldUser = await User.findOne(query);

    if (oldUser) {
      //encrypt user password
      encryptPassword = await bcrypt.hash(req.body.password,10);

      // update user's password property in the database
      const updatedUser = await User.findOneAndUpdate(query, { password: encryptPassword }, { new: true });
      
      res.status(200).send(updatedUser);
    }

    res.status(400).send("Can't find user. Please Register!!!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }

});



module.exports = router;