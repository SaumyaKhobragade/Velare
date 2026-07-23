import express from 'express';
import passport from 'passport';
import isLoggedIn, { saveRedirectURL } from '../middleware.js';

import * as userController from '../controllers/users.js';

const router = express.Router();

router.get('/signup', userController.renderSignupForm);

router.post('/signup', userController.signupUser);

router.get('/login', userController.renderLoginForm);

router.post('/login', saveRedirectURL, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.loginUser);

router.get('/logout', userController.logoutUser);

export default router;
