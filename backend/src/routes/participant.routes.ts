import express from 'express';
import { ParticipantControler } from '../controlers/participant.controler';

const participantRouter = express.Router();

participantRouter.route('/getAllParticipantsForCountry').post(
    (req, res) => new ParticipantControler().getAllParticipantsForCountry(req, res)
);

participantRouter.route('/submitParticipant').post(
    (req, res) => new ParticipantControler().submitParticipant(req, res)
);

export default participantRouter;