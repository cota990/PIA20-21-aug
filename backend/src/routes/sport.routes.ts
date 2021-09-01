import express from 'express';
import { SportControler } from '../controlers/sport.controler';

const sportRouter = express.Router();

sportRouter.route('/getAllSports').get(
    (req, res) => new SportControler().getAllSports (req, res)
);

sportRouter.route('/getAllTeamSports').get(
    (req, res) => new SportControler().getAllTeamSports (req, res)
);

sportRouter.route('/getAllSportsInOlympics').get(
    (req, res) => new SportControler().getAllSportsInOlympics (req, res)
);

sportRouter.route('/getAllTeamSportsInOlympics').get(
    (req, res) => new SportControler().getAllTeamSportsInOlympics (req, res)
);

sportRouter.route('/getAllSportsNotInOlympics').get(
    (req, res) => new SportControler().getAllSportsNotInOlympics (req, res)
);

sportRouter.route('/addToOlympics').post(
    (req, res) => new SportControler().addToOlympics (req, res)
);

export default sportRouter;