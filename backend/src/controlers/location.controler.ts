import express from 'express';
import Location from '../models/location';

export class LocationControler {

    getAllLocations = (req: express.Request, res: express.Response) => {

        Location.find({}, (err, locations) => {

            if (err) console.log (err);
            else
                res.json(locations);
                
        })

    }

}