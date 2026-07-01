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
