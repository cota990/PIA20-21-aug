import express from 'express';
import { RecordControler } from '../controlers/record.controler';

const recordRouter = express.Router();

recordRouter.route('/getAllRecords').get(
    (req, res) => new RecordControler().getAllRecords(req, res)
);

export default recordRouter;