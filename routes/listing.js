// Import required dependencies and modules
const express = require("express");
const router = express.Router();

// Middleware and utility
const wrapAsync = require("../utils/wrapAsync.js");

// Middlewares
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route('/')
  // Index Route
  .get(
  (wrapAsync(listingControllers.index))
  )
  // Create Route
  .post(
    isLoggedIn,
    // validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingControllers.createListing)
  );

//New Route
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router
  .route("/:id")
  //Show route
  .get(wrapAsync(listingControllers.show))
  // Update Route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControllers.updateListing)
  )
  // Delete route
  .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.renderEditForm)
);

//filteredListings
router.get("/category/:category", wrapAsync(listingControllers.filteredListings));

// searchListings
router.get("/destination", wrapAsync(listingControllers.searchListings));

module.exports = router;
