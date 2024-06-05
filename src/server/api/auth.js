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

/*
// GET userId's cart with cartStatus 'current'
router.get("/current", auth.protection, async (req, res, next) => {
  try {
    console.log(req.user);
    const result = await prisma.cart.findFirst({
      where: {
        userId: Number(req.user.userId),
        cartStatus: "current",
      },
    });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

// GET userId's cart with cartStatus 'current'
// Only one cart per user should have cartStatus 'current'
router.get("/cart", auth.protection, async (req, res, next) => {
  try {
    const result = await prisma.cart.findFirst({
      where: {
        userId: Number(req.user.userId),
        cartStatus: "current",
      },
    });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

// GET all carts by userId in request, with associated cartItems
// Does not include product details for cartItems
router.get("/history", auth.protection, async (req, res, next) => {
  try {
    const result = await prisma.cart.findMany({
      where: {
        userId: Number(req.user.userId),
      },
      include: {
        cartItems: true,
      },
    });
    res.send(result);
  } catch (error) {
    next(error);
  }
});


// GET user by userId (Admin only)
router.get("/:userId", auth.adminProtection, async (req, res, next) => {
  try {
    const result = await prisma.user.findUnique({
      where: {
        userId: Number(req.params.userId),
      },
    });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

// GET user currently logged in
router.get("/", auth.protection, async (req, res, next) => {
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



// GET userId's cart with cartStatus 'current', including all related cartItems and products
// Only one cart per user should have cartStatus 'current'
router.get("/cart/details", auth.protection, async (req, res, next) => {
  try {
    const result = await prisma.cart.findFirst({
      where: {
        userId: Number(req.user.userId),
        cartStatus: "current",
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
    res.send(result);
  } catch (error) {
    next(error);
  }
});


// GET a cart (AKA order) belonging to the logged in user, with cartItems and product details
// Regular users will use this to find specific carts, not the api/carts/ routes
router.get("/history/:cartId", auth.protection, async (req, res, next) => {
  try {
    const result = await prisma.cart.findUnique({
      where: {
        cartId: Number(req.params.cartId),
        userId: Number(req.user.userId),
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

// POST a new user (Registration)
router.post("/", async (req, res, next) => {
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

// POST user login
// Returns a token
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
      { userId: user.userId, isAdmin: user.isAdmin },
      process.env.JWT
    );

    res.send({
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        isAdmin: user.isAdmin
      },
    });
  } catch (err) {
    next(err);
  }
});

// PUT user data into the logged in user
router.put("/", auth.protection, async (req, res, next) => {
  const salt_rounds = 5;
  const hashedPassword = await bcrypt.hash(req.body.password, salt_rounds);

  try {
    const result = await prisma.user.update({
      where: {
        userId: Number(req.user.userId),
      },
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
    res.send(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
*/