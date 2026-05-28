import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import Listing from './models/listing.js';

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

mongoose.connect('mongodb://127.0.0.1:27017/velare')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Working');
});

// Index Route
app.get('/listings', async (req, res) => {
    try {
        const listings = await Listing.find({});
        res.render('listings/index', { listings });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// New Route
app.get('/listings/new', (req, res) => {
    res.render('listings/new');
});

//Show Route
app.get('/listings/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).send('Listing not found');
        }
        res.render('listings/show', { listing });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// Create Route
app.post('/listings', async (req, res) => {
    try {
        const newListing = new Listing(req.body);
        await newListing.save();
        res.redirect('/listings');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// Edit Route
app.get('/listings/:id/edit', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).send('Listing not found');
        }
        res.render('listings/edit', { listing });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// Update Route
app.put('/listings/:id', async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!listing) {
            return res.status(404).send('Listing not found');
        }
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// Delete Route
app.delete('/listings/:id', async (req, res) => {
    try {
        const listing = await Listing.findByIdAndDelete(req.params.id);
        if (!listing) {
            return res.status(404).send('Listing not found');
        }
        res.redirect('/listings');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
