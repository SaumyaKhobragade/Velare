import Review from '../models/review.js';
import Listing from '../models/listing.js';
import wrapAsync from '../utils/wrapAsync.js';

export const createReview = wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash('success', 'Successfully added a new review!');
    res.redirect(`/listings/${listing._id}`);
});

export const destroyReview = wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    const listing = await Listing.findById(id);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/listings/${listing._id}`);
});
