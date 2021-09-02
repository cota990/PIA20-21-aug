import express from 'express';
import ScoreFormat from '../models/scoreFormat';

export class ScoreFormatControler {

    getAllScoreFormats = (req: express.Request, res: express.Response) => {

        ScoreFormat.find({}, (err, scoreFormats) => {

            if (err) console.log (err);
            else
                res.json(scoreFormats);

        });
        
    }
}