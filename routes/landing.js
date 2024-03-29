// Import required dependencies and modules
const express = require("express");
const router = express.Router();

// Middleware and utility
const wrapAsync = require("../utils/wrapAsync.js");

// Middlewares
const listingControllers = require("../controllers/listings.js");


// Index Route
router
  .get("/",
  (wrapAsync(listingControllers.index))
  )

  module.exports = router;

