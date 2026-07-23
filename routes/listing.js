import express from 'express';
import isLoggedIn, { isOwner, validateListing } from '../middleware.js';
import multer from 'multer';

import * as listingController from '../controllers/listings.js';

const router = express.Router({ mergeParams: true });
const { cloudinaryStorage } = await import('../cloudConfig.js');
const upload = multer({ storage: cloudinaryStorage });

router.route('/')
    .get(listingController.index)
    .post(isLoggedIn, validateListing, upload.single('listing[image]'), listingController.createListing);

router.get('/new', isLoggedIn, listingController.renderNewForm);

router.route('/:id')
    .get(listingController.showListing)
    .put(isLoggedIn, isOwner, validateListing, upload.single('listing[image]'), listingController.updateListing)
    .delete(isLoggedIn, isOwner, listingController.destroyListing);

router.get('/:id/edit', isLoggedIn, isOwner, listingController.renderEditForm);

export default router;
