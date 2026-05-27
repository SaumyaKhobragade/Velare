import mongoose from 'mongoose';
import sampleListings from './data.js';
import Listing from '../models/listing.js';

mongoose.connect('mongodb://127.0.0.1:27017/velare')
    .then(() => {
        console.log('MongoDB connected');
        // Insert sample listings
        Listing.deleteMany({})
            .then(() => console.log('Existing listings cleared'))
            .catch(err => console.error('Error clearing existing listings:', err));
        Listing.insertMany(sampleListings)
            .then(() => console.log('Sample listings inserted'))
            .catch(err => console.error('Error inserting sample listings:', err));
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));