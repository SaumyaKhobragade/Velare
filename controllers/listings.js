import Listing from "../models/listing.js";
import wrapAsync from "../utils/wrapAsync.js";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";

const mapToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapToken });

export const index = wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index", { listings });
});

export const renderNewForm = (req, res) => {
    res.render("listings/new");
};

export const showListing = wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
});

export const createListing = wrapAsync(async (req, res, next) => {
    let response = await geocoder
        .forwardGeocode({
            query: req.body.listing.location + ", " + req.body.listing.country,
            limit: 1,
        })
        .send()

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
    };
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
});

export const renderEditForm = wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit", { listing, originalImageUrl });
});

export const updateListing = wrapAsync(async (req, res) => {
    const finalListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body.listing,
        { returnDocument: "after" },
    );

    if (typeof req.file !== "undefined") {
        finalListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await finalListing.save();
    }
    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${finalListing._id}`);
});

export const destroyListing = wrapAsync(async (req, res) => {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted listing!");
    res.redirect("/listings");
});
