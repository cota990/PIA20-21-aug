import express from 'express';
import Participant from '../models/participant';

export class ParticipantControler {

    getAllParticipantsForCountry = (req: express.Request, res: express.Response) => {

        let country = req.body.country;

        Participant.find({'country': country}, (err, participants) => {
            if (err) console.log (err);
            else
                res.json (participants);
        })
    }
}