// Import required dependencies and modules
const express = require("express");
const router = express.Router({ mergeParams: true });

// Middleware and utlities
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/reviews.js");

const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")

// POST review Route
router.post(
  "/", // common part of route cut and use in app.js
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.postReview)
);

// Delete review route
router.delete(
  "/:reviewId", //child route
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
