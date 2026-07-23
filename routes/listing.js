import express from 'express';
import isLoggedIn, { isOwner, validateListing } from '../middleware.js';

import * as listingController from '../controllers/listings.js';

const router = express.Router({ mergeParams: true });

// Index Route
router.get('/', listingController.index);

// New Route
router.get('/new', isLoggedIn, listingController.renderNewForm);

//Show Route
router.get('/:id', listingController.showListing);

// Create Route
router.post('/', isLoggedIn, validateListing, listingController.createListing);

// Edit Route
router.get('/:id/edit', isLoggedIn, isOwner, listingController.renderEditForm);

// Update Route
router.put('/:id', isLoggedIn, isOwner, validateListing, listingController.updateListing);

// Delete Route
router.delete('/:id', isLoggedIn, isOwner, listingController.destroyListing);

export default router;
