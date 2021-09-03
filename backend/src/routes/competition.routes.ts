import express from 'express';
import { CompetitionControler } from '../controlers/competition.controler';

const competitionRouter = express.Router();

competitionRouter.route('/startCompetitionByOrganizer').post(
    (req, res) => new CompetitionControler().startCompetitionByOrganizer(req, res)
);

export default competitionRouter;