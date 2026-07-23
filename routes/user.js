import express from 'express';
import passport from 'passport';
import isLoggedIn, { saveRedirectURL } from '../middleware.js';

import * as userController from '../controllers/users.js';

const router = express.Router();

router.route('/signup')
    .get(userController.renderSignupForm)
    .post(userController.signupUser);

router.route('/login')
    .get(userController.renderLoginForm)
    .post(saveRedirectURL, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.loginUser);

router.get('/logout', userController.logoutUser);

export default router;
