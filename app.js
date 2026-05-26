import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';

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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});