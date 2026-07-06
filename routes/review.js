import express from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import Review from '../models/review.js';
import Listing from '../models/listing.js';
import { validateReview } from '../middleware.js';

const router = express.Router({ mergeParams: true });

// Post Route for Reviews
router.post('/', validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash('success', 'Successfully added a new review!');
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Route for Reviews
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    const listing = await Listing.findById(id);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/listings/${listing._id}`);
}));

export default router;
