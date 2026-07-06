import Listing from './models/listing.js';
import wrapAsync from './utils/wrapAsync.js';

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

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to modify this listing!");
        return res.redirect(`/listings/${req.params.id}`);
    }

    next();
});