import express from 'express';
import { ScoreFormatControler } from '../controlers/scoreFormat.controler';

const scoreFormatRouter = express.Router();

scoreFormatRouter.route('/getAllScoreFormats').get(
    (req, res) => new ScoreFormatControler().getAllScoreFormats(req, res)
);

export default scoreFormatRouter;