import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import joi from 'joi';

import Listing from './models/listing.js';
import wrapAsync from './utils/wrapAsync.js';
import ExpressError from './utils/ExpressError.js';
import listingSchema from './schema.js';
import Review from './models/review.js';
import { reviewSchema } from './schema.js';

import listingRoutes from './routes/listing.js';

const app = express();
const port = 3000;
const Schema = mongoose.Schema;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);

mongoose.connect('mongodb://127.0.0.1:27017/velare')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Working');
});

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

app.use('/listings', listingRoutes);

// Reviews
// Post Route for Reviews
app.post('/listings/:id/reviews', validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Route for Reviews
app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    const listing = await Listing.findById(id);
    res.redirect(`/listings/${listing._id}`);
}));

app.use((req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;
    // res.status(statusCode).send(message);
    res.render('error', { statusCode, message });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
