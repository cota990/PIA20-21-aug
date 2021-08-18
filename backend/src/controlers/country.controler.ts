import express from 'express';
import Country from '../models/country';

export class CountryControler {

    getAllCountries = (req: express.Request, res: express.Response) => {

        Country.find({}, (err, countries) => {

            if (err) console.log (err);
            else
                res.json(countries);
        })
    }
    
}