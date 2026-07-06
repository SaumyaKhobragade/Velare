import express from 'express';
import Listing from '../models/listing.js';
import wrapAsync from '../utils/wrapAsync.js';
import isLoggedIn, { isOwner, validateListing } from '../middleware.js';

const router = express.Router({ mergeParams: true });

// Index Route
router.get('/', wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index', { listings });
}));

// New Route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('listings/new');
});

//Show Route
router.get('/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate('reviews').populate('owner');
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
}));

// Create Route
router.post('/', isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect('/listings');
}));

// Edit Route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/edit', { listing });
}));

// Update Route
router.put('/:id', isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    const finalListing = await Listing.findByIdAndUpdate(req.params.id, req.body.listing, { returnDocument: 'after' });
    req.flash('success', 'Successfully updated listing!');
    res.redirect(`/listings/${finalListing._id}`);
}));

// Delete Route
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted listing!');
    res.redirect('/listings');
}));

export default router;
