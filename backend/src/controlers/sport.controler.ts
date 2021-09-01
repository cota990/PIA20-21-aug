import express from 'express';
import Sport from '../models/sport';

export class SportControler {

    getAllSports = (req: express.Request, res: express.Response) => {

        Sport.find({}, (err, sports) => {
            
            if (err) console.log (err);
            else
                res.json (sports);

        });

    }

    getAllTeamSports = (req: express.Request, res: express.Response) => {

        Sport.find ({'type': 'T'}, (err, sports) => {

            if (err) console.log (err);
            else
                res.json (sports);

        });

    }

    getAllSportsInOlympics  = (req: express.Request, res: express.Response) => {

        Sport.find({'currentInOlympics': true}, (err, sports) => {
            
            if (err) console.log (err);
            else
                res.json (sports);

        });

    }

    getAllTeamSportsInOlympics = (req: express.Request, res: express.Response) => {

        Sport.find ({'type': 'T', 'currentInOlympics': true}, (err, sports) => {

            if (err) console.log (err);
            else
                res.json (sports);

        });

    }

    getAllSportsNotInOlympics = (req: express.Request, res: express.Response) => {

        Sport.find({'currentInOlympics': false}, (err, sports) => {
            
            if (err) console.log (err);
            else
                res.json (sports);

        });

    }

    addToOlympics = (req: express.Request, res: express.Response) => {

        let name = req.body.sport;
        let discipline = req.body.discipline;

        Sport.findOneAndUpdate({'name': name, 'discipline' : discipline}, {'currentInOlympics': true}, (err, sport) => {
            
            if (err) console.log (err);
            else {

                if (sport) {
                    
                    let sportObj = sport.toObject({getters: true});
                    return res.status(200).json ({'message': 'Successfully added new discipline', 'sport': sportObj.name, 'discipline': sportObj.discipline});

                }

                else
                    return res.status(200).json ({'message': 'Sport or discipline not found in DB'});
            }

        });

    }
    
}