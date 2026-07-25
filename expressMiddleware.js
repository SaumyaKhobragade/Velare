import Listing from './models/listing.js';
import Review from './models/review.js';
import wrapAsync from './utils/wrapAsync.js';
import ExpressError from './utils/ExpressError.js';
import listingSchema from './schema.js';
import { reviewSchema } from './schema.js';

export default function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        // Redirect URL
        req.session.returnTo = req.originalUrl;

        req.flash('error', 'You must be signed in to create or modify a listing!');
        return res.redirect('/login');
    }
    next();
};

export function saveRedirectURL(req, res, next) {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
        delete req.session.returnTo;
    }
    next();
};

export const isOwner = wrapAsync(async (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in to modify a listing!");
        return res.redirect("/login");
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }

    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to modify this listing!");
        return res.redirect(`/listings/${req.params.id}`);
    }

    next();
});

export const isReviewAuthor = wrapAsync(async (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in to modify a listing!");
        return res.redirect("/login");
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }

    const review = await Review.findById(req.params.reviewId);

    if (!review) {
        req.flash("error", "Cannot find that review!");
        return res.redirect(`/listings/${req.params.id}`);
    }

    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to modify this review!");
        return res.redirect(`/listings/${req.params.id}`);
    }

    next();
});

export const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

export const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
