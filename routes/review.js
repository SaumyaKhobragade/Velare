import express from 'express';
import isLoggedIn, { validateReview, isReviewAuthor } from '../middleware.js';

import * as reviewController from '../controllers/reviews.js'; 

const router = express.Router({ mergeParams: true });

// Post Route for Reviews
router.post('/', isLoggedIn, validateReview, reviewController.createReview);

// Delete Route for Reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviewController.destroyReview);

export default router;
