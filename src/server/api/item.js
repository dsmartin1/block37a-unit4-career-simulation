const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const middleware = require('../middleware')

// GET all items
router.get("/", async (req, res, next) => {
  try {
    const result = await prisma.item.findMany();
    res.send(result);
  } catch (error) {
    next(error);
  }
});

// GET item by itemId
router.get("/:itemId", async (req, res, next) => {
    try {
      const result = await prisma.item.findUnique({
        where: {
          itemId: Number(req.params.itemId),
        },
      });
      res.send(result);
    } catch (error) {
      next(error);
    }
});

// GET reviews for an item with an itemId
router.get("/:itemId/reviews", async (req, res, next) => {
    try {
      const result = await prisma.review.findMany({
        where: {
          itemId: Number(req.params.itemId),
        },
      });
      res.send(result);
    } catch (error) {
      next(error);
    }
});

// GET review with a reviewId for an item with an itemId
router.get("/:itemId/reviews/:reviewId", async (req, res, next) => {
  try {
    const result = await prisma.review.findFirst({
      where: {
        itemId: Number(req.params.itemId),
        reviewId: Number(req.params.reviewId)
      },
    });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

// POST a review for an item with an itemId
router.post("/:itemId/reviews", middleware.protection, async (req, res, next) => {
  try {
    const result = await prisma.review.create({
      data: {
        itemId: Number(req.params.itemId),
        userId: Number(req.user.userId),
        text: String(req.body.text),
        score: Number(req.body.score)
      },
    });
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
});

// POST a comment for a review with a reviewId, for an item with an itemId
// NOTE: itemId is not used by comments, but the route was requested by the client
router.post("/:itemId/reviews/:reviewId/comments", middleware.protection, async (req, res, next) => {
  try {
    const result = await prisma.comment.create({
      data: {
        reviewId: Number(req.params.reviewId),
        userId: Number(req.user.userId),
        text: String(req.body.text)
      },
    });
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;