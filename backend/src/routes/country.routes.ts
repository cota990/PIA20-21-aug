import express from 'express';
import { CountryControler } from '../controlers/country.controler';

const countryRouter = express.Router();

countryRouter.route('/getAllCountries').get(
    (req, res) => new CountryControler().getAllCountries(req, res)
);

countryRouter.route('/getCountryByAbbr').post(
    (req, res) => new CountryControler().getCountryByAbbr(req, res)
);

export default countryRouter;