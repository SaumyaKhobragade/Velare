import User from '../models/user.js';
import wrapAsync from '../utils/wrapAsync.js';

export const renderSignupForm = (req, res) => {
    res.render('users/signup');
};

export const signupUser = wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Velare!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
});

export const renderLoginForm = (req, res) => {
    res.render('users/login');
};

export const loginUser = async (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/listings';
    res.redirect(redirectUrl);
};

export const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/listings');
    });
};
