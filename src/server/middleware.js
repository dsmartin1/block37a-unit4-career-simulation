const jwt = require("jsonwebtoken");
const process = require("process");

// Authentication middleware
const protection = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).send("No token provided.");
    }

    req.user = jwt.verify(token, process.env.JWT);
    next();
  } catch (error) {
    return res.status(403).send(`Failed to authenticate token.`);
  }
};

module.exports = { protection };  