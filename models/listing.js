const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,  
  location: String,
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", //model
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", //model
  },
  destination:{
    type:String,
    enum:["trending","rooms","tiny homes","beach","iconic cities","mountains","camping","amazing pools","castles","arctic","amazing views","lake","sky-in/out","countryside","islands","windmills","creative spaces"]
  },
  category:{
    type:String,
    enum:["trending","rooms","tiny homes","beach","iconic cities","mountains","camping","amazing pools","castles","arctic","amazing views","lake","sky-in/out","countryside","islands","windmills","creative spaces"]
  }
});

// mongoose middleware to dlt existing reviews after deleting listing
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
