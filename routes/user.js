import express from 'express';
import User from '../models/user.js';
import wrapAsync from '../utils/wrapAsync.js';

const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/signup', wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to Velare!');
        res.redirect('/listings');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

export default router;