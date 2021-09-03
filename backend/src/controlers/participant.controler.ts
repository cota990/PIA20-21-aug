import express from 'express';
import Participant from '../models/participant';
import Country from '../models/country';
import Team from '../models/team';
import Sport from '../models/sport';

export class ParticipantControler {

    getAllParticipantsForCountry = (req: express.Request, res: express.Response) => {

        let country = req.body.country;

        Participant.find({'country': country}, (err, participants) => {
            if (err) console.log (err);
            else
                res.json (participants);
        })
    }

    getAllParticipants = (req: express.Request, res: express.Response) => {

        Participant.find({}, (err, participants) => {

            if (err) console.log (err);
            else
                res.json (participants);
                
        });

    }

    // submitParticipant
    // participant key: firstname, lastname, gender, country!!
    // required checks: if exists by key
    // if exists:
    //     - check if sport matches
    //     - if sport matches:
    //         - check if new disciplines
    //         - if new disciplines:
    //               - check for team disciplines for potential maxPlayer breach
    //               - if no breach: update
    //               - if breach: report
    //         - if no new disciplines: report
    //     - if sport does not match: report
    // if not exists:
    //      - check for team disciplines for potential maxPlayer breach
    //               - if no breach: insert
    //               - if breach: report

    // TODO CHECK IF COMPETITION STARTED

    submitParticipant = (req: express.Request, res: express.Response) => {

        let firstname =  req.body.firstname;
        let lastname =  req.body.lastname;
        let gender = req.body.gender;
        let sport =  req.body.sport;
        let disciplines: Array<String> = req.body.disciplines;
        let country = req.body.country;
        let fullname = firstname + ' ' + lastname;

        // check for participant by key
        Participant.findOne({'firstname': firstname, 'lastname': lastname, 'gender': gender, 'country': country}, (err, participant) => {

            if (err) console.log (err);
            else {

                if (participant) {

                    // participant found; check for sport match
                    let partObj = participant.toObject({ getters: true });

                    if (partObj.sport != sport) {

                        return res.status(200).json({'message': 'Participant already added for different sport'});

                    }

                    else {

                        // sport matches; check for new disciplines

                        let updateDisciplines: String[] = partObj.disciplines;
                        let newDisciplines: String[] = [];

                        disciplines.forEach ((discipline) => {

                            if (partObj.disciplines.indexOf(disciplines) == -1) 
                                newDisciplines.push (discipline);
                            updateDisciplines.push (discipline);

                        })

                        if (newDisciplines.length == 0) {

                            return res.status(200).json ({'message': 'Submitted participant already added for those disciplines'});

                        }

                        else {

                            // update required; check for team disciplines

                            Sport.find({'type': 'T'}, (err, sports) => {

                                if (err) console.log (err);
                        
                                else {

                                    let teamDisciplines: String[] = [];
                                    let maxPlayersArray: Number[] = [];

                                    sports.forEach ((sport) => {
                                        
                                        let foundSport = sport.toObject({ getters: true });

                                        if (newDisciplines.indexOf (foundSport.discipline) >= 0) {
                                            // perform check

                                            teamDisciplines.push (foundSport.discipline);
                                            maxPlayersArray.push (foundSport.maxPlayers);
                                        }
                                    
                                    });

                                    if (teamDisciplines.length > 0) {

                                        // found team disciplines; find all participants in all disciplines
                                        Participant.find({'country': country, 'gender': gender, 'sport': sport, 'disciplines': {$in: teamDisciplines}}, (err, p) => {

                                            if (err) console.log (err);
                                            else {

                                                // must order received participants by discipline

                                                let i = 0;

                                                for (i = 0; i < teamDisciplines.length; i = i + 1) {

                                                    let cnt = 0;

                                                    p.forEach ((part) => {

                                                        let partObj = part.toObject({ getters: true });

                                                        if (partObj.disciplines.indexOf(teamDisciplines[i]) >= 0)
                                                            cnt++;
                                                    })

                                                    if (cnt >= maxPlayersArray[i])
                                                        return res.status(200).json({'message': 'Cant add user to ' + teamDisciplines[i] + ' because it would exceed maximum allowed players'});
                                                
                                                }

                                                // if here, participant can be updated
                                                Participant.findOneAndUpdate({'firstname': firstname, 'lastname': lastname, 'gender': gender, 'country': country}, {'disciplines': updateDisciplines}, (err, updated) => {

                                                    if (err) console.log (err);
                                                    else {
                
                                                        if (updated)
                                                            return res.status(200).json ({'message': 'Successfully updated participants disciplines'});
                
                                                        else
                                                            return res.status(200).json ({'message': 'Error while updating participatints disciplines'});
                                                    }
                                                });

                                            }

                                        });

                                    }

                                    else {

                                        // no team disciplines; procceed to update
                                        Participant.findOneAndUpdate({'firstname': firstname, 'lastname': lastname, 'gender': gender, 'country': country}, {'disciplines': updateDisciplines}, (err, updated) => {

                                            if (err) console.log (err);
                                            else {
        
                                                if (updated)
                                                    return res.status(200).json ({'message': 'Successfully updated participants disciplines'});
        
                                                else
                                                    return res.status(200).json ({'message': 'Error while updating participatints disciplines'});
                                            }
                                        });

                                    }

                                }
                            });

                        }

                    }

                }

                else {

                    // participant not found
                    // check for team disciplines for potential maxPlayers breach

                    Sport.find({'type': 'T'}, (err, sports) => {

                        if (err) console.log (err);
                        
                        else {

                            let teamDisciplines: String[] = [];
                            let maxPlayersArray: Number[] = [];

                            console.log (disciplines);

                            sports.forEach ((sport) => {
                                
                                let foundSport = sport.toObject({ getters: true });

                                console.log (foundSport);
                                console.log (disciplines.indexOf (foundSport.discipline));

                                if (disciplines.indexOf (foundSport.discipline) >= 0) {
                                    // perform check

                                    teamDisciplines.push (foundSport.discipline);
                                    maxPlayersArray.push (foundSport.maxPlayers);
                                }
                            
                            })

                            console.log (teamDisciplines.length);
                            console.log (maxPlayersArray.length);
                            console.log (teamDisciplines);
                            console.log (maxPlayersArray);

                            if (teamDisciplines.length > 0) {

                                // found team disciplines; find all participants in all disciplines
                                Participant.find({'country': country, 'gender': gender, 'sport': sport, 'disciplines': {$in: teamDisciplines}}, (err, p) => {

                                    if (err) console.log (err);
                                    else {

                                        // must order received participants by discipline

                                        let i = 0;

                                        for (i = 0; i < teamDisciplines.length; i = i + 1) {

                                            let cnt = 0;

                                            p.forEach ((part) => {

                                                let partObj = part.toObject({ getters: true });

                                                if (partObj.disciplines.indexOf(teamDisciplines[i]) >= 0)
                                                    cnt++;
                                            })

                                            if (cnt >= maxPlayersArray[i])
                                                return res.status(200).json({'message': 'Cant add user to ' + teamDisciplines[i] + ' because it would exceed maximum allowed players'});
                                        
                                        }

                                        // if here, participant can be added
                                        let data = {
                                            firstname: firstname,
                                            lastname: lastname,
                                            gender: gender,
                                            sport: sport,
                                            disciplines: disciplines,
                                            country: country,
                                            fullname: fullname
                                        }
                    
                                        let newParticipant = new Participant (data);
                    
                                        newParticipant.save().then( (part) => {

                                            Country.findOneAndUpdate({'abbr': country}, {$inc : {'numOfParticipants' : 1}}, (err, c) => {
                                                if (err) console.log (err);
                                                else {
                                                    return res.status(200).json ({'message': 'Successfully added new participant'});
                                                }
                                            })
                                            
                                        }).catch ((err) => {
                                            return res.status(200).json ({'message': 'There was an error while processing your request. Please try again later'});
                                        })

                                    }

                                });
                            
                            }

                            else {

                                // no team disciplines; procceed to addition
                                let data = {
                                    firstname: firstname,
                                    lastname: lastname,
                                    gender: gender,
                                    sport: sport,
                                    disciplines: disciplines,
                                    country: country,
                                    fullname: fullname
                                }
            
                                let newParticipant = new Participant (data);
            
                                newParticipant.save().then( (part) => {

                                    Country.findOneAndUpdate({'abbr': country}, {$inc : {'numOfParticipants' : 1}}, (err, c) => {
                                        if (err) console.log (err);
                                        else {
                                            return res.status(200).json ({'message': 'Successfully added new participant'});
                                        }
                                    })
                                    
                                }).catch ((err) => {
                                    return res.status(200).json ({'message': 'There was an error while processing your request. Please try again later'});
                                })

                            }
                        
                        }
                    
                    });
                }
            }

        })
    }

    getAllParticipantsForIndividualDiscipline = (req: express.Request, res: express.Response) => {

        let gender = req.body.gender;
        let sport = req.body.sport;
        let discipline = req.body.discipline;

        Participant.find({'gender': gender, 'sport': sport, 'disciplines': {$in: discipline}}, (err, participants) => {

            if (err) console.log (err);
            else
                res.json(participants);

        });
        
    }

}