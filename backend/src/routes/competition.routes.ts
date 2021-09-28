import express from 'express';
import { CompetitionControler } from '../controlers/competition.controler';

const competitionRouter = express.Router();

competitionRouter.route('/startCompetitionByOrganizer').post(
    (req, res) => new CompetitionControler().startCompetitionByOrganizer(req, res)
);

competitionRouter.route('/getAllCompetitionsForDelegate').post(
    (req, res) => new CompetitionControler().getAllCompetitionsForDelegate(req, res)
);

competitionRouter.route('/generateSchedule').post(
    (req, res) => new CompetitionControler().generateSchedule(req, res)
);

competitionRouter.route('/updateSchedule').post(
    (req, res) => new CompetitionControler().updateSchedule(req, res)
);

competitionRouter.route('/submitResults').post(
    (req, res) => new CompetitionControler().submitResults(req, res)
);

competitionRouter.route('/finnishCompetition').post(
    (req, res) => new CompetitionControler().finnishCompetition(req, res)
);

export default competitionRouter;