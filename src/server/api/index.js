const express = require("express");
const router = express.Router();

router.use("/users", require("./user"));
router.use("/items", require("./item"));
router.use("/reviews", require("./review"));
router.use("/comments", require("./comment"));
router.use("/auth", require("./auth"));

module.exports = router;