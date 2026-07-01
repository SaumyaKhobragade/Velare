export default function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in to create or modify a listing!');
        return res.redirect('/login');
    }
    next();
}