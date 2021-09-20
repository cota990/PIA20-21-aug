import express from 'express';
import Participant from '../models/participant';
import Country from '../models/country';
import Competition from '../models/competition';
import { Utils } from '../utils/utils';
import Team from '../models/team';

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
    // check if competition for disciplines have already started; if any, report error
    // check if participant is already added
    // if added:
    //      - check if sport matches
    //      - if matches check if there is any new disciplines
    //          - if new disciplines, check for any team disciplines for potential maximum player breach
    //              - if no breach: update participants disciplines (and update team players for team disciplines)
    //              - if breach: report error (max players for disciplines)
    //          - if no new disciplines : report error (no new disciplines to add)
    //      - if no match: report error (participant already added to different sport)
    // if not added:
    //      - check for any team disciplines for potential maximum player breach
    //          - if no breach: insert new participant, update country number of participants and update team players for team discipline
    //          - if breach: report error (max players for disciplines)

    submitParticipant = async (req: express.Request, res: express.Response) => {

        let firstname =  req.body.firstname;
        let lastname =  req.body.lastname;
        let gender = req.body.gender;
        let sport =  req.body.sport;
        let disciplines: string[] = req.body.disciplines;
        let country = req.body.country;
        let fullname = firstname + ' ' + lastname;

        let updateDisciplines: string[];
        let teamDisciplines: string[] = [];

        let errorFound: boolean = false;

        let errorReport = {
            message: 'Errors found',
            competitionsStarted: '',
            teamDisciplines: '',
            differentSport: '',
            noNewDisciplines: ''
        };

        const competitions = await Competition.find ({'sport': sport, 'gender': gender, 'discipline': {$in: disciplines}});

        if (competitions.length > 0) {

            let report = 'Competitions already started for following disciplines: ';

            competitions.forEach ((c) => {

                let compObj = c.toObject({getters: true});

                report += compObj.discipline + ', ';

            })

            report = report.slice(0, report.length - 2);
            report += '.';

            errorReport.competitionsStarted = report;
            errorFound = true;

        }

        const participant = await Participant.findOne({'firstname': firstname, 'lastname': lastname, 'gender': gender, 'country': country});

        if (participant) {

            // participant found; check for sport match
            let partObj = participant.toObject({ getters: true });

            if (partObj.sport != sport) {

                errorFound = true;
                errorReport.differentSport = 'Participant already added for different sport';

            }

            else {

                // sport matches; check for new disciplines

                updateDisciplines = partObj.disciplines;
                let newDisciplines: string[] = [];

                disciplines.forEach ((discipline) => {

                    if (partObj.disciplines.indexOf(discipline) == -1) 
                        newDisciplines.push (discipline);
                    updateDisciplines.push (discipline);

                })

                if (newDisciplines.length == 0) {

                    errorFound = true;
                    errorReport.noNewDisciplines = 'Participant already added for for selected disciplines';

                }

                else {

                    const checkForTeamDisciplines = await new Utils().checkForTeamDisciplines(newDisciplines, country, gender, sport);

                    if (!checkForTeamDisciplines.proceed) {
                
                        errorFound = true;
                        errorReport.teamDisciplines = checkForTeamDisciplines.report;

                    }

                    else {

                        teamDisciplines = checkForTeamDisciplines.disciplines;

                    }

                }

            }

        }

        else {

            // participant not found
            // check for team disciplines for potential maxPlayers breach

            const checkForTeamDisciplines = await new Utils().checkForTeamDisciplines(disciplines, country, gender, sport);

            console.log (checkForTeamDisciplines);

            if (!checkForTeamDisciplines.proceed) {
                
                errorFound = true;
                errorReport.teamDisciplines = checkForTeamDisciplines.report;

            }

            else {

                teamDisciplines = checkForTeamDisciplines.disciplines;
                
            }

        }

        if (errorFound) {

            res.json (errorReport);

        }

        else {

            if (participant) {

                let updatedParticipant = await Participant.findOneAndUpdate({'firstname': firstname, 'lastname': lastname, 'gender': gender, 'country': country}, {'disciplines': updateDisciplines}).exec();
                
                if (updatedParticipant) {

                    if (teamDisciplines.length > 0) {

                        for (let i = 0; i < teamDisciplines.length; i++) {

                            let teamUpdated = await Team.findOneAndUpdate({'country': country, 'gender': gender, 'sport': sport, 'discipline': teamDisciplines[i]}, {$inc : {'numOfPlayers' : 1}});

                            if (!teamUpdated)
                                errorFound = true;

                        }

                        if (errorFound)
                            return res.status(200).json ({'message': 'Error while updating participatints disciplines'});

                        else
                            return res.status(200).json ({'message': 'Successfully updated participants disciplines'});

                    }

                    else
                        return res.status(200).json ({'message': 'Successfully updated participants disciplines'});

                }

                else {

                    return res.status(200).json ({'message': 'Error while updating participatints disciplines'});

                }

            }

            else {

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

                const newP = await newParticipant.save();

                if (newP) {

                    const countryUpdated = await Country.findOneAndUpdate({'abbr': country}, {$inc : {'numOfParticipants' : 1}});

                    if (countryUpdated) {

                        if (teamDisciplines.length > 0) {

                            for (let i = 0; i < teamDisciplines.length; i++) {

                                console.log (teamDisciplines[i]);
    
                                let teamUpdated = await Team.findOneAndUpdate({'country': country, 'gender': gender, 'sport': sport, 'discipline': teamDisciplines[i]}, {$inc : {'numOfPlayers' : 1}});
    
                                if (!teamUpdated)
                                    errorFound = true;
    
                            }
    
                            if (errorFound)
                                return res.status(200).json ({'message': 'There was an error while processing your request. Please try again later'});
    
                            else
                                return res.status(200).json ({'message': 'Successfully added new participant'});
    
                        }
    
                        else
                            return res.status(200).json ({'message': 'Successfully added new participant'});

                    }

                    else {

                        return res.status(200).json ({'message': 'There was an error while processing your request. Please try again later'});

                    }

                }

                else {

                    return res.status(200).json ({'message': 'There was an error while processing your request. Please try again later'});

                }

            }

        }

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