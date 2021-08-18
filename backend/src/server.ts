import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/user.routes';
import countryRouter from './routes/country.routes';

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/PIA-PROJEKAT');
const connection = mongoose.connection;
connection.once('open', () => {
    console.log ('Successfully connected to MongoDB');
})

const router = express.Router();
// add router uses later
router.use('/users', userRouter);
router.use('/countries', countryRouter);

app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));