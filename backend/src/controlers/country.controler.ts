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

    getCountryByAbbr = (req: express.Request, res: express.Response) => {

        let country = req.body.country;

        Country.findOne({'abbr': country}, (err, country) => {
            
            if (err) console.log (err);
            else
                res.json(country);

        })
    }

}