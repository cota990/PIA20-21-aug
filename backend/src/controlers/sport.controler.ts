import express from 'express';
import Sport from '../models/sport';

export class SportControler {

    getAllSports = (req: express.Request, res: express.Response) => {

        Sport.find({}, (err, sports) => {
            if (err) console.log (err);
            else
                res.json (sports);
        })
    }
}