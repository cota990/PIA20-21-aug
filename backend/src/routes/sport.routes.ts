import express from 'express';
import { SportControler } from '../controlers/sport.controler';

const sportRouter = express.Router();

sportRouter.route('/getAllSports').get(
    (req, res) => new SportControler().getAllSports (req, res)
);

export default sportRouter;