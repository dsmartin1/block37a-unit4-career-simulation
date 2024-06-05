const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const middleware = require('../middleware')

// GET reviews belonging to the user
router.get("/me", middleware.protection, async (req, res, next) => {
    try {
      const result = await prisma.review.findMany({
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