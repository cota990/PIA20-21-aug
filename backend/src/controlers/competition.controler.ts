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
                                qualificationGroup: phases == 'Q' ? '' : undefined,
                                qualificationResult: phases == 'Q' ? '' : undefined ,
                                qualificationPosition: phases == 'Q' ? 0 : undefined,
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

                    else if (phases == 'Q') {

                        round = 'Q';
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

    getAllCompetitionsForDelegate = (req: express.Request, res: express.Response) => {

        let delegate = req.body.delegate;

        Competition.find({'delegates': delegate}, (err, competitions) => {

            if (err) console.log (err);
            else
                res.json (competitions);

        })
    }

    // if format is qualification + finals:
    //     - check if more than 8 participants/teams
    //     - if more: generate qualification groups, then generate finals
    //     - if not more: go straight to finals

    generateSchedule = async (req: express.Request, res: express.Response) => {

        console.log (req.body);

        let errorFound: boolean = false;
        let errorReport = {
            
            message: 'Errors found',
            noCompetition: '',
            competitionCompleted: '',
            scheduleGenerated: ''
        };

        let sport = req.body.sport;
        let discipline = req.body.discipline;
        let gender = req.body.gender;

        let phases = req.body.phases;
        let category = req.body.category;
        let participants = req.body.participants;
        let teams = req.body.teams;

        const competition = await Competition.findOne ({'sport': sport, 'discipline': discipline, 'gender': gender}).exec();

        let competitionForUpdate;

        if (!competition) {

            errorFound = true;
            errorReport.noCompetition = 'No competition for that sport, discipline and gender is started';

        }

        else {

            let competitionObj = competition.toObject({getters: true});

            if (competitionObj.status == 'C') {

                errorFound = true;
                errorReport.competitionCompleted = 'Competition is already finnished';

            }

            else if (competitionObj.status == 'D') {

                errorFound = true;
                errorReport.scheduleGenerated = 'Schedule for that competition is already generated';

            }

            else {

                if (phases == 'Q') {

                    console.log ('qualification + finals');
        
                    let numOfCompetitors = -1;
        
                    if (category == 'I')
                        numOfCompetitors = participants.length;
        
                    else if (category == 'T')
                        numOfCompetitors = teams.length;
        
                    console.log ('numOfCompetitors: ' + numOfCompetitors);
        
                    if (numOfCompetitors <= 2) 
                        console.log ('cant have competition with less than 3 competitors');
        
                    if (numOfCompetitors > 8) {
        
                        // generate qualification groups

                        let numOfGroups = Math.floor((numOfCompetitors / 8)) + 1;

                        for (let i = 0; i < numOfGroups; i++) {

                            let groupObj = {

                                startDateTime: '',
                                location: '',
                                phase: 'Q',
                                group: 'Group ' + (i + 1),
                                confirmed: false,
                                canAssign: true

                            }

                            competitionObj.schedule.push (groupObj);

                        }

                        let competitorsDraw = [], competitors = [];
                        if (category == 'I')
                            competitorsDraw = participants;
            
                        else if (category == 'T')
                            competitorsDraw = teams;

                        let i = 0;

                        while (competitors.length < numOfCompetitors) {

                            i = (i % numOfGroups) + 1;
                            let randPosition = Math.floor (Math.random() * (numOfCompetitors - competitors.length));

                            let competitor = competitorsDraw.splice (randPosition, 1)[0];

                            competitor.qualificationGroup = 'Group ' + i;

                            competitors.push (competitor);

                        }

                        if (category == 'I')
                            competitionObj.participants = competitors;
            
                        else if (category == 'T')
                            competitionObj.teams = competitors;
    

                    }

                    let groupObj = {

                        startDateTime: '',
                        location: '',
                        phase: 'F',
                        confirmed: false,
                        canAssign: numOfCompetitors < 9 ? true : false

                    }

                    competitionObj.schedule.push(groupObj);

                    if (numOfCompetitors <= 8) 
                        competitionObj.round = 'F';

                    competitionObj.status = 'D';
        
                }                    
                
                else if (phases == 'F') {
                    
                    console.log ('only finals');

                    let finalsObj = {

                        startDateTime: '',
                        location: '',
                        phase: 'F',
                        confirmed: false,
                        canAssign: true

                    }

                    competitionObj.schedule.push(finalsObj);

                    competitionObj.status = 'D';

                }
        
                else if (phases == 'K')
                    console.log ('knockout stage');
        
                else if (phases == 'G')
                    console.log ('group stage');

            }

            competitionForUpdate = new Competition (competitionObj);

        }

        if (errorFound)
            res.json (errorReport);
        else {

            const competitionReturn = await Competition.findOneAndUpdate ({'sport': sport, 'discipline': discipline, 'gender': gender}, competitionForUpdate).exec();

            res.json (competitionForUpdate);

        }
            

    }

    updateSchedule = async (req: express.Request, res: express.Response) => {

        console.log (req.body);

        let errorFound: boolean = false;
        let errorReport = {
            
            message: 'Errors found',
            noCompetition: '',
            competitionCompleted: '',
            scheduleGenerated: '',
            overlaps: '',
            datesOutOfRange: ''
        };

        let sport = req.body.sport;
        let discipline = req.body.discipline;
        let gender = req.body.gender;

        let schedule = req.body.schedule;
        let phases = req.body.phases;
        let round = req.body.round;

        let startDateTime = req.body.startDate + " 00:00:00";
        let endDateTime = req.body.endDate + " 23:59:59";

        let start = new Date (startDateTime);
        let end = new Date (endDateTime);

        const competition = await Competition.findOne ({'sport': sport, 'discipline': discipline, 'gender': gender}).exec();

        let competitionForUpdate;

        if (!competition) {

            errorFound = true;
            errorReport.noCompetition = 'No competition for that sport, discipline and gender is started';

        }

        else {

            let competitionObj = competition.toObject({getters: true});

            if (competitionObj.status == 'C') {

                errorFound = true;
                errorReport.competitionCompleted = 'Competition is already finnished';

            }

            else if (competitionObj.status == 'O') {

                errorFound = true;
                errorReport.scheduleGenerated = 'Schedule for that competition is not generated';

            }

            else {

                if (phases == 'Q') {

                    console.log ('qualification + finals');

                    // go through schedule objects; check for new starts and locations; check for possible overlaps (in sent items; then in already saved items)

                    for (let i = 0; i < schedule.length; i++) {

                        if (!schedule[i].confirmed  && schedule[i].canAssign && schedule[i].startDateTime != undefined && schedule[i].location != undefined
                            && schedule[i].startDateTime != '' && schedule[i].location != '') {

                            // check for overlap in new scheduling

                            console.log (schedule[i]);

                            let overlap = await Competition.find({'schedule.location': schedule[i].location, 'schedule.startDateTime': schedule[i].startDateTime}).exec();

                            console.log (overlap.length > 0)

                            if (overlap.length > 0) {

                                errorFound = true;
                                errorReport.overlaps += 'Other event is previously scheduled on ' + schedule[i].startDateTime + ' at location ' + schedule[i].location + '. ';

                            }

                            else {

                                let eventStart = new Date (schedule[i].startDateTime);

                                if (eventStart < start || eventStart > end) {

                                    errorFound = true;

                                    if (eventStart < start)
                                        errorReport.datesOutOfRange = 'Starting date for competition is ' + req.body.startDate;

                                    else
                                        errorReport.datesOutOfRange = 'Ending date for competition is ' + req.body.endDate;
                                }

                                else
                                    schedule[i].confirmed = true;

                            }

                        }

                    }

                    // check if all quals are confirmed

                    console.log ('check for new assign');
                    console.log (schedule);

                    let previousPhaseCompleted = true;

                    for (let i = 0; i < schedule.length; i++) {

                        if (!schedule[i].confirmed  && schedule[i].phase == 'Q') {

                            previousPhaseCompleted = false;

                        }

                    }

                    console.log (previousPhaseCompleted);

                    if (previousPhaseCompleted) {

                        for (let i = 0; i < schedule.length; i++) {

                            if (!schedule[i].confirmed  && schedule[i].phase == 'F') {
    
                                schedule[i].canAssign = true;
    
                            }
    
                        }

                    }

                }

                else if (phases == 'F') {

                    console.log ('only finals');

                    // go through schedule objects; check for new starts and locations; check for possible overlaps (in sent items; then in already saved items)

                    for (let i = 0; i < schedule.length; i++) {

                        if (!schedule[i].confirmed  && schedule[i].canAssign && schedule[i].startDateTime != undefined && schedule[i].location != undefined
                            && schedule[i].startDateTime != '' && schedule[i].location != '') {

                            // check for overlap in new scheduling

                            console.log (schedule[i]);

                            let overlap = await Competition.find({'schedule.location': schedule[i].location, 'schedule.startDateTime': schedule[i].startDateTime}).exec();

                            console.log (overlap.length > 0)

                            if (overlap.length > 0) {

                                errorFound = true;
                                errorReport.overlaps += 'Other event is previously scheduled on ' + schedule[i].startDateTime + ' at location ' + schedule[i].location + '. ';

                            }

                            else {

                                let eventStart = new Date (schedule[i].startDateTime);

                                if (eventStart < start || eventStart > end) {

                                    errorFound = true;

                                    if (eventStart < start)
                                        errorReport.datesOutOfRange = 'Starting date for competition is ' + req.body.startDate;

                                    else
                                        errorReport.datesOutOfRange = 'Ending date for competition is ' + req.body.endDate;
                                }

                                else
                                    schedule[i].confirmed = true;

                            }

                        }

                    }

                }

            }

            competitionForUpdate = competitionObj;

        }

        if (errorFound)
            res.json (errorReport);
        else {

            competitionForUpdate.schedule = schedule;

            const competitionReturn = await Competition.findOneAndUpdate ({'sport': sport, 'discipline': discipline, 'gender': gender}, competitionForUpdate).exec();

            res.json (competitionForUpdate);

        }


    }

    submitResults = async (req: express.Request, res: express.Response) => {

        console.log (req.body);

        let errorFound: boolean = false;
        let errorReport = {
            
            message: 'Errors found',
            noCompetition: '',
            competitionCompleted: '',
            scheduleGenerated: '',
            overlaps: '',
            datesOutOfRange: ''
        };

        let sport = req.body.sport;
        let discipline = req.body.discipline;
        let gender = req.body.gender;

        let phases = req.body.phases;
        let round = req.body.round;

        const competition = await Competition.findOne ({'sport': sport, 'discipline': discipline, 'gender': gender}).exec();

        let competitionForUpdate;

        if (!competition) {

            errorFound = true;
            errorReport.noCompetition = 'No competition for that sport, discipline and gender is started';

        }

        else {

            let competitionObj = competition.toObject({getters: true});

            if (competitionObj.status == 'C') {

                errorFound = true;
                errorReport.competitionCompleted = 'Competition is already finnished';

            }

            else if (competitionObj.status == 'O') {

                errorFound = true;
                errorReport.scheduleGenerated = 'Schedule for that competition is not generated';

            }

            else {

            }

        }

        if (errorFound)
            res.json (errorReport);
        else {

            //competitionForUpdate.schedule = schedule;

            const competitionReturn = await Competition.findOneAndUpdate ({'sport': sport, 'discipline': discipline, 'gender': gender}, competitionForUpdate).exec();

            res.json (competitionForUpdate);

        }

    }

}