const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.show = async (req, res) => {
  let { id } = req.params; //extract id
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does't exist!");
    req.redirect("listings/index.ejs");
  }
  //   console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, "..", filename);

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  console.log(newListing);

  req.flash("success", "New listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImgUrl = listing.image.url;
  originalImgUrl = originalImgUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImgUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== undefined) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  console.log(listing);
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  console.log(deletedListing);
  res.redirect("/listings");
};

module.exports.filteredListings = async (req, res) => {
  const { category } = req.params;
  const filteredListings = await Listing.find({ category:category });
  res.render("listings/filteredListings", { filteredListings, category });
};

module.exports.searchListings = async (req, res) => {
  let { destination } = req.query;
  console.log(req.query);
  if (!destination) {
    return res.status(400).send("Destination parameter is missing");
  }
  const searchListings = await Listing.find({ destination });
  console.log(searchListings);
  res.render("listings/searchListings", { searchListings, destination });
};