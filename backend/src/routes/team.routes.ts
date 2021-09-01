import express from 'express';
import { TeamControler } from '../controlers/team.controler';

const teamRouter = express.Router();

teamRouter.route('/submitTeam').post(
    (req, res) => new TeamControler().submitTeam(req, res)
);

export default teamRouter;