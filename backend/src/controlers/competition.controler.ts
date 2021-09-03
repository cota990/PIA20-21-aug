import express from 'express';
import User from '../models/user';
import Competition from '../models/competition';

export class CompetitionControler {

    startCompetitionByOrganizer = (req: express.Request, res: express.Response) => {

        let sport = req.body.sport;
        let discipline = req.body.discipline;
        let category = req.body.category;
        let gender = req.body.gender;
        let format = req.body.format;
        let allowedResults = req.body.allowedResults;
        let phases = req.body.phases;
        let rounds = req.body.rounds;
        let startDate = req.body.startDate;
        let endDate = req.body.endDate;
        let locations = req.body.locations;
        let delegates: String[] = req.body.delegates;
        let participants: String[] = req.body.participants;
        let teams: String[] = req.body.teams;

        Competition.findOne({'sport': sport, 'discipline': discipline, 'category': category, 'gender': gender}, (err, competition) => {

            if (err) console.log (err);
            else {

                if (competition)
                    res.json ({'message': 'Competition already started'});
                
                else {

                    let emptyStringArray: String[] = []; 

                    // participants for individual disciplines
                    let participantsData: Array<Object> = [];
                    
                    if (category == 'I') {

                        participants.forEach ((part) => {

                            let newParticipant = {
                                fullname: part,
                                seeded: category == 'K' ? 0 : undefined,
                                roundResults: rounds != 1 ? emptyStringArray : undefined,
                                finalResult: '',
                                finalPosition: 0
                            }

                            participantsData.push (newParticipant);

                        });

                    }

                    // teams for team disciplines

                    let teamsData: Array<Object> = [];
                    
                    if (category == 'T') {

                        teams.forEach ((team) => {

                            let newTeam = {
                                country: team,
                                seed: phases != 'F' ? '' : undefined,
                                finalResult: phases == 'F'? '' : undefined,
                                finalPosition: 0,
                                group: phases == 'G' ? '' : undefined,
                                groupPoints: phases == 'G' ? '' : undefined
                            }

                            teamsData.push (newTeam);

                        });

                    }

                    // round of competition

                    let round = '';
                    let numOfRounds:Number;

                    if (phases == 'F') {
                        
                        round = 'F';
                        numOfRounds = rounds;

                    }

                    else if (phases == 'K') {

                        if (category == 'I') {

                            if (participants.length == 4)
                                round = 'SF';

                            else if (participants.length == 8)
                                round = 'QF';

                            else if (participants.length == 16)
                                round = 'R16';

                        }

                        else if (category == 'T') {

                            if (teams.length == 4)
                                round = 'SF';

                            else if (teams.length == 8)
                                round = 'QF';

                            else if (teams.length == 16)
                                round = 'R16';

                        }

                    }

                    else if (phases == 'G') {
                        
                        round = '1';

                        if (category == 'I')
                            numOfRounds = (participants.length / 2) - 1;

                        else if (category == 'T')
                            numOfRounds = (teams.length / 2) - 1;

                    }

                    let data = {
                        sport: sport,
                        discipline: discipline,
                        gender: gender,
                        category: category,
                        startDate: startDate,
                        endDate: endDate,
                        locations: locations,
                        status: 'O',
                        round: round,
                        delegates: delegates,
                        participants: category == 'I' ? participantsData : undefined,
                        teams: category == 'T' ? teamsData : undefined,
                        scoreFormat: format,
                        allowedResults: allowedResults,
                        phases: phases,
                        numOfRounds: numOfRounds != undefined ? numOfRounds : undefined

                    }

                    let newCompetition = new Competition(data);

                    newCompetition.save().then ((comp) => {
                        //res.status(200).json({'message': 'Competition successfully started'});

                        // update delegates competitions
                        
                        delegates.forEach ( (delegate) => {

                            User.findOneAndUpdate({'username': delegate}, {$inc: {'numOfCompetitions': 1}}, (err, user) => {

                                if (err) console.log (err);
                            
                            });
                        
                        });
                        res.status(200).json({'message': 'Competition successfully started'});
                    }).catch((err) => {
                        console.log (err);
                        res.status(200).json({'message': 'There was an error while processing your request. Please try again later'});
                    })


                }

            }

        });

    }

}