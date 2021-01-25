const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Users = require("../../data/users-model.js");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./secret.js");

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 12);

  Users.add({ username, password: hash })
    .then((user) => {
      res.status(201).json({ data: user });
    })
    .catch((err) => res.json({ error: err.message }));
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then((user) => {
      // const user = users[0];
      if (user && bcrypt.compareSync(password, user.password)) {
        console.log(user);
        const token = generateToken(user);
        res.status(201).json({
          message: `Welcome ${user.username}! Here's your token:`,
          token,
        });
      } else {
        res.status(401).json({ error: "Sorry, you're up to no good!" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
