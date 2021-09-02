import express from 'express';
import { LocationControler } from '../controlers/location.controler';

const locationRouter = express.Router();

locationRouter.route('/getAllLocations').get(
    (req, res) => new LocationControler().getAllLocations(req, res)
);

export default locationRouter;