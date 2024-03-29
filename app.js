if(process.env.NODE_ENV != "production"){
  require('dotenv').config()

}

// Import required dependencies and modules
const express = require("express");
const app = express();
// const bodyparser = require('body-parser');
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Middleware and utilities
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

// Importing the routes for managing listings and reviews
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const landingRouter = require("./routes/landing.js")

// Mongo_Atlas URL--------
const dbUrl = process.env.ATLASDB_URL;

// Establish the MongoDB connection and handle the promise
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl); // Connect to MongoDB
}
// ========================================================================

// Configuration and setup of Express application
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views")); 
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded bodies
app.use(methodOverride("_method")); // Middleware to override HTTP methods
app.engine("ejs", ejsMate); // Use ejsMate for rendering EJS templates
app.use(express.static(path.join(__dirname, "/public"))); // Middleware for serving static files from the 'public' directory


//Mongo-connect store-----
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

// If any occur in our mongo-store
store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

// Session configuration options
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true ,
  cookie: {
    expires: Date.now() + 10 * 24 * 60 * 60 * 1000,
    maxAge: 10 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

// Note - before Imported route we have to use it.Cz route er help ei egulo use krbo
app.use(session(sessionOptions));
app.use(flash());

// *  Must session er por likhte hbe age na
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware to store flash by using res.locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  // console.log(res.locals.success);
  res.locals.currUser = req.user;
  next();
});

// Mounting the imported routes into the main Express app
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/", landingRouter);


// For random route which are not available in our route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
}); 

// Middleware to handle errors
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", {message});
});
   
app.listen(8080, () => {
  console.log("server is listening to port 8080");
}); 