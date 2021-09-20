import express from 'express';
import Team from '../models/team';
import Participant from '../models/participant';
import Sport from '../models/sport';
import Competition from '../models/competition';

export class TeamControler {

    // submitTeam
    // team key: country, gender, sport, discipline!!
    // check if competition for discipline have already started; if any, report error
    // check if team is already added; if added report error
    // find sport to check if minimum players are added
    // if no errors, add team

    submitTeam = async (req: express.Request, res: express.Response) => {

        let country = req.body.country;
        let gender = req.body.gender;
        let sport = req.body.sport;
        let discipline = req.body.discipline;

        let errorFound: boolean = false;

        let numOfPlayers: number = 0;

        let errorReport = {
            message: 'Errors found',
            competitionStarted: '',
            teamAdded: '',
            sportNotFound: '',
            minimumPlayers: ''
        };

        const competition = await Competition.findOne ({'sport': sport, 'gender': gender, 'discipline': discipline}).exec();

        if (competition) {

            // competition already started

            let report = 'Competition already started for discipline: ' + discipline;

            errorFound = true;
            errorReport.competitionStarted = report;

        }

        const team = await Team.findOne({'sport': sport, 'gender': gender, 'discipline': discipline, 'country': country}).exec();

        if (team) {

            let report = 'Team already added for discipline: ' + discipline;

            errorFound = true;
            errorReport.teamAdded = report;

        }

        const sportFound = await Sport.findOne({'name': sport, 'discipline': discipline}).exec();

        if (sportFound) {

            let foundSportObj = sportFound.toObject({ getters: true });

            // fetch participants to check if minimum number of players is registered
            const foundParticipants = await Participant.find({'country': country, 'gender': gender, 'sport': sport, 'disciplines': {$in: discipline}}).exec();

            numOfPlayers = foundParticipants.length;

            if (numOfPlayers < foundSportObj.minPlayers) {

                let report = 'Required number of registered players for ' + foundSportObj.discipline + ' is ' 
                                + foundSportObj.minPlayers + '. Currently registered players for ' + foundSportObj.discipline + ' is ' + numOfPlayers
                                + '. Please register more players.';

                errorFound = true;
                errorReport.minimumPlayers = report;

            }

        }

        else {

            let report = 'No information for sport: ' + sport + ' and discipline:' +  discipline;

            errorFound = true;
            errorReport.sportNotFound = report;

        }

        if (errorFound) {

            return res.json (errorReport);

        }

        else {

            let data = {
                country: country,
                gender: gender,
                sport: sport,
                discipline: discipline,
                numOfPlayers: numOfPlayers
            }

            let newTeam = new Team (data);

            newTeam.save().then((team) => {

                return res.status(200).json ({'message': 'Successfully registered team'});

            }).catch ((err) => {

                return res.status(200).json ({'message': 'There was an error while processing your request. Please try again later'});

            });

        }
        
    }

    getAllTeamsForTeamDiscipline = (req: express.Request, res: express.Response) => {

        let gender = req.body.gender;
        let sport = req.body.sport;
        let discipline = req.body.discipline;

        Team.find({'sport': sport, 'gender': gender, 'discipline': discipline}, (err, teams) => {

            if (err) console.log (err);
            else
                res.json (teams);

        });

    }

}