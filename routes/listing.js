import express from 'express';
import Listing from '../models/listing.js';
import wrapAsync from '../utils/wrapAsync.js';
import ExpressError from '../utils/ExpressError.js';
import listingSchema from '../schema.js';

const router = express.Router({ mergeParams: true });

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// Index Route
router.get('/', wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index', { listings });
}));

// New Route
router.get('/new', (req, res) => {
    res.render('listings/new');
});

//Show Route
router.get('/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate('reviews');
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
}));

// Create Route
router.post('/', validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect('/listings');
}));

// Edit Route
router.get('/:id/edit', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/edit', { listing });
}));

// Update Route
router.put('/:id', validateListing, wrapAsync(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body.listing, { returnDocument: 'after' });
    req.flash('success', 'Successfully updated listing!');
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Route
router.delete('/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted listing!');
    res.redirect('/listings');
}));

export default router;
