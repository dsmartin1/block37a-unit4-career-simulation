const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const middleware = require("../middleware");

// POST a new user (Registration)
router.post("/register", async (req, res, next) => {
  
  const salt_rounds = 5;
  const hashedPassword = await bcrypt.hash(req.body.password, salt_rounds);
  
  try {
    const result = await prisma.user.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        streetAddress: req.body.streetAddress,
        city: req.body.city,
        zipcode: req.body.zipcode,
        billingAddress: req.body.billingAddress,
        billingCity: req.body.billingCity,
        billingZipcode: req.body.billingZipcode,
        phone: req.body.phone,
      },
    });

    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// POST user login, returning a token if successful
router.post("/login", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.body.username },
    });

    if (!user) {
      return res.status(401).send("Invalid Login");
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);

    if (!isValid) {
      return res.status(401).send("Invalid Login");
    }

    const token = jwt.sign(
      { userId: user.userId },
      process.env.JWT
    );

    res.send({
      token,
    });
  } catch (err) {
    next(err);
  }
});

// GET user currently logged in (by token/ID)
router.get("/me", middleware.protection, async (req, res, next) => {
  try {
    const result = await prisma.user.findUnique({
      where: {
        userId: Number(req.user.userId),
      },
    });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;