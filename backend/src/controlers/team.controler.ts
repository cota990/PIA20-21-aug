import express from 'express';
import Team from '../models/team';
import Participant from '../models/participant';
import Sport from '../models/sport';

export class TeamControler {

    submitTeam = (req: express.Request, res: express.Response) => {

        let country = req.body.country;
        let gender = req.body.gender;
        let sport = req.body.sport;
        let discipline = req.body.discipline;

        //fetch numOfPlayers

        Sport.findOne({'name': sport, 'discipline': discipline}, (err, foundSport) => {

            if (err) console.log (err);

            else {

                if (foundSport) {

                    let foundSportObj = foundSport.toObject({ getters: true });

                    // fetch participants to check if minimum number of players is registered
                    Participant.find({'country': country, 'gender': gender, 'sport': sport, 'disciplines': {$in: discipline}}, (err, participants) => {

                        if (err) console.log (err);
            
                        else {
            
                            if (participants.length < foundSportObj.minPlayers)
                                return res.status(200).json({'message': 'Required number of registered players for ' + foundSportObj.discipline + ' is ' 
                                    + foundSportObj.minPlayers + '. Currently registered players for ' + foundSportObj.discipline + ' is ' + participants.length
                                    + '. Please register more players.' });

                            else {

                                let data = {
                                    country: country,
                                    gender: gender,
                                    sport: sport,
                                    discipline: discipline,
                                    numOfPlayers: participants.length
                                }

                                let newTeam = new Team (data);

                                newTeam.save().then((team) => {

                                    return res.status(200).json ({'message': 'Successfully registered team'});

                                }).catch ((err) => {

                                    return res.status(200).json ({'message': 'There was an error while processing your request. Please try again later'});

                                });

                            }
                        
                        }
            
                    })

                }

                else
                    return res.status(200).json({'message': 'Sport not found in db'});
            }

        });
        
    }

}