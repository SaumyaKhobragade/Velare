import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import Listing from './models/listing.js';
import ejsMate from 'ejs-mate';
import wrapAsync from './utils/wrapAsync.js';
import ExpressError from './utils/ExpressError.js';

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

// Index Route
app.get('/listings', wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index', { listings });
}));

// New Route
app.get('/listings/new', (req, res) => {
    res.render('listings/new');
});

//Show Route
app.get('/listings/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/show', { listing });
}));

// Create Route
app.post('/listings', wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError('Invalid Listing Data', 400);
    }
    const newListing = new Listing(req.body);
    await newListing.save();
    res.redirect('/listings');
}));

// Edit Route
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/edit', { listing });
}));

// Update Route
app.put('/listings/:id', wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError('Invalid Listing Data', 400);
    }
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Route
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    res.redirect('/listings');
}));

app.use((req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).send(message);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
