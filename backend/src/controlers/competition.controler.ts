import express from 'express';
import User from '../models/user';
import Competition from '../models/competition';
import Participant from '../models/participant';
import Country from '../models/country';

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
                                groupPoints: phases == 'G' ? '' : undefined,
                                qualificationGroup: phases == 'Q' ? '' : undefined,
                                qualificationResult: phases == 'Q' ? '' : undefined ,
                                qualificationPosition: phases == 'Q' ? 0 : undefined,
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
                        canComplete: false,
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
        let numOfRounds = req.body.numOfRounds;

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

                    let emptyArray:Object[] = [];
        
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
                                canAssign: true,
                                completed: false,
                                round: numOfRounds == undefined ? undefined : 1,
                                competitors: [{}]

                            }

                            groupObj.competitors.pop();

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

                            let competitorInsert = {
                                competitor: '',
                                result: ''
                            }

                            if (category == 'I')
                                competitorInsert.competitor = competitor.fullname;
            
                            else if (category == 'T')
                                competitorInsert.competitor = competitor.country;

                            for (let j = 0; j < competitionObj.schedule.length; j++) {

                                if (competitionObj.schedule[j].group == ('Group ' + i))
                                    competitionObj.schedule[j].competitors.push (competitorInsert);
                            
                            }

                            

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
                        canAssign: numOfCompetitors < 9 ? true : false,
                        completed: false,
                        round: numOfRounds == undefined ? undefined : 1,
                        competitors: [{}]

                    }

                    groupObj.competitors.pop();

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
                        canAssign: true,
                        completed: false,
                        round: numOfRounds == undefined ? undefined : 1,
                        competitors: [{}]

                    }

                    finalsObj.competitors.pop();

                    if (category == 'I') {

                        for (let i = 0; i < participants.length; i++) {

                            let competitorInsert = {
                                competitor: participants[i].fullname,
                                result: ''
                            }

                            finalsObj.competitors.push (competitorInsert);

                        }

                    }

                    else if (category == 'T') {

                        for (let i = 0; i < teams.length; i++) {

                            let competitorInsert = {
                                competitor: teams[i].country,
                                result: ''
                            }

                            finalsObj.competitors.push (competitorInsert);

                        }

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
        let category = req.body.category;
        let numOfRounds = req.body.numOfRounds;
        let schedule = req.body.schedule;
        let scoreFormat = req.body.scoreFormat;

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

                let newSchedules:any[] = []

                if (round == 'Q') {

                    // go through schedule, check for event phase; if match check if previously completed; if not check if results are added, then complete that round
                    // after that check if there should be next round scheduled and if there should be phase moved

                    for (let i = 0; i < schedule.length; i++) {

                        if (schedule[i].phase == round && !schedule[i].completed) {

                            let comp = true;

                            for (let j = 0; j < schedule[i].competitors.length; j++) {

                                if (schedule[i].competitors[j].result == '')
                                    comp = false;
                            
                            }

                            if (comp) {
                                
                                schedule[i].completed = true;

                                if (schedule[i].round != undefined && numOfRounds != undefined && schedule[i].round < numOfRounds) {

                                    let scheduleObj = {

                                        startDateTime: schedule[i].startDateTime,
                                        location: schedule[i].location,
                                        phase: schedule[i].phase,
                                        confirmed: true,
                                        canAssign: true,
                                        completed: false,
                                        round: numOfRounds == undefined ? undefined : parseInt(schedule[i].round) + 1,
                                        competitors: [{}]
                
                                    }

                                    scheduleObj.competitors.pop ();

                                    for (let j = 0; j < schedule[i].competitors.length; j++) {

                                        let newCompetitor = {
                                            competitor: schedule[i].competitors[j].competitor,
                                            result: ''
                                        }

                                        scheduleObj.competitors.push (newCompetitor);
                                    
                                    }

                                    newSchedules.push (scheduleObj);

                                }

                            }

                        }

                    }

                    if (newSchedules.length > 0) {

                        for (let i = 0; i < newSchedules.length; i++) {

                            schedule.push (newSchedules[i]);

                        }

                    }

                    // phase moving and finals generation

                    let phaseCompleted = true;

                    for (let i = 0; i < schedule.length; i++) {

                        if (schedule[i].phase == round && !schedule[i].completed)
                            phaseCompleted = false;

                    }

                    console.log ('phaseCompleted: ' + phaseCompleted);

                    if (phaseCompleted) {

                        competitionObj.round = 'F';

                        // rank qualified competitors; if multiple rounds collect score

                        let qualRankings:any[] = [];

                        for (let i = 0; i < schedule.length; i++) {

                            if (schedule[i].phase == round) {

                                if (numOfRounds == undefined || numOfRounds == 1) {

                                    for (let j = 0; j < schedule[i].competitors.length; j++) {

                                        let newRankingEntry = {
                                            competitor: schedule[i].competitors[j].competitor,
                                            result: schedule[i].competitors[j].result
                                        }

                                        qualRankings.push(newRankingEntry);

                                    }

                                }

                                else if (numOfRounds > 1) {

                                    for (let j = 0; j < schedule[i].competitors.length; j++) {

                                        let found: boolean = false;

                                        for (let k = 0; k < qualRankings.length; k++)
                                            if (qualRankings[k].competitor == schedule[i].competitors[j].competitor)
                                                found = true;

                                        if (!found) {

                                            let newRankingEntry = {
                                                competitor: schedule[i].competitors[j].competitor,
                                                result: schedule[i].competitors[j].result
                                            }
    
                                            qualRankings.push(newRankingEntry);

                                        }

                                        else {

                                            for (let k = 0; k < qualRankings.length; k++)
                                                if (qualRankings[k].competitor == schedule[i].competitors[j].competitor) {

                                                    if (scoreFormat == 'points') {

                                                        qualRankings[k].result += schedule[i].competitors[j].result;

                                                    }

                                                    else if (scoreFormat == 'distance') {

                                                        if (schedule[i].competitors[j].result > qualRankings[k].result)
                                                            qualRankings[k].result = schedule[i].competitors[j].result;

                                                    }

                                                    else {

                                                        if (schedule[i].competitors[j].result < qualRankings[k].result)
                                                            qualRankings[k].result = schedule[i].competitors[j].result;

                                                    }
                                                }


                                        }

                                    }

                                }

                            }

                        }

                        // sort qual rankings 

                        qualRankings.sort ((a, b) => {

                            if (a.result < b.result && (scoreFormat == 'points' || scoreFormat == 'distance')) return 1;
                            else if (a.result < b.result && !(scoreFormat == 'points' || scoreFormat == 'distance')) return -1;
                            else if (a.result > b.result && (scoreFormat == 'points' || scoreFormat == 'distance')) return -1;
                            else if (a.result > b.result && !(scoreFormat == 'points' || scoreFormat == 'distance')) return 1;
                            else return 0;

                        })

                        // fill participants/teams qual results

                        if (category == 'I') {

                            for (let i = 0; i < qualRankings.length; i++) {

                                for (let j = 0; j < competitionObj.participants.length; j++) {

                                    if (qualRankings[i].competitor == competitionObj.participants[j].fullname) {

                                        competitionObj.participants[j].qualificationResult = qualRankings[i].result;
                                        competitionObj.participants[j].qualificationPosition = i + 1;

                                        if (i > 7) {

                                            competitionObj.participants[j].finalPosition = i + 1;

                                        }

                                        break;

                                    }

                                }

                            }


                        }

                        else if (category == 'T') {

                            for (let i = 0; i < qualRankings.length; i++) {

                                for (let j = 0; j < competitionObj.teams.length; j++) {

                                    if (qualRankings[i].competitor == competitionObj.teams[j].country) {

                                        competitionObj.teams[j].qualificationResult = qualRankings[i].result;
                                        competitionObj.teams[j].qualificationPosition = i + 1;

                                        if (i > 7) {

                                            competitionObj.teams[j].finalPosition = i + 1;

                                        }

                                        break;

                                    }

                                }

                            }

                        }

                        qualRankings = qualRankings.splice(0, 8);

                        for (let i = 0; i < schedule.length; i++) {

                            if (schedule[i].phase == competitionObj.round) {
                                
                                schedule[i].competitors = qualRankings;

                                for (let j = 0; j < schedule[i].competitors.length; j++)
                                    schedule[i].competitors[j].result = '';

                            }

                        }

                    }

                    competitionObj.schedule = schedule;

                }

                else if (round == 'F') {

                    if (phases == 'Q' || phases == 'F') {

                        // go through schedule, check for event phase; if match check if previously completed; if not check if results are added, then complete that round
                        // after that check if there should be next round scheduled and if there should be phase moved

                        for (let i = 0; i < schedule.length; i++) {

                            if (schedule[i].phase == round && !schedule[i].completed) {

                                let comp = true;

                                for (let j = 0; j < schedule[i].competitors.length; j++) {

                                    if (schedule[i].competitors[j].result == '')
                                        comp = false;
                                
                                }

                                if (comp) {
                                
                                    schedule[i].completed = true;
    
                                    if (schedule[i].round != undefined && numOfRounds != undefined && schedule[i].round < numOfRounds) {
    
                                        let scheduleObj = {
    
                                            startDateTime: schedule[i].startDateTime,
                                            location: schedule[i].location,
                                            phase: schedule[i].phase,
                                            confirmed: true,
                                            canAssign: true,
                                            completed: false,
                                            round: numOfRounds == undefined ? undefined : parseInt(schedule[i].round) + 1,
                                            competitors: [{}]
                    
                                        }
    
                                        scheduleObj.competitors.pop ();

                                        for (let j = 0; j < schedule[i].competitors.length; j++) {

                                            let newCompetitor = {
                                                competitor: schedule[i].competitors[j].competitor,
                                                result: ''
                                            }
    
                                            scheduleObj.competitors.push (newCompetitor);
                                        
                                        }
    
                                        newSchedules.push (scheduleObj);
    
                                    }
    
                                }

                            }

                        }

                        if (newSchedules.length > 0) {

                            for (let i = 0; i < newSchedules.length; i++) {
    
                                schedule.push (newSchedules[i]);
    
                            }
    
                        }

                        // check for extra rounds; if not complete competition

                        let phaseCompleted = true;

                        for (let i = 0; i < schedule.length; i++) {

                            if (schedule[i].phase == round && !schedule[i].completed)
                                phaseCompleted = false;

                        }

                        competitionObj.schedule = schedule;

                        console.log ('phaseCompleted: ' + phaseCompleted);

                        if (phaseCompleted) {

                            let finalRankings:any[] = [];

                            for (let i = 0; i < schedule.length; i++) {

                                if (schedule[i].phase == round) {
    
                                    if (numOfRounds == undefined || numOfRounds == 1) {
    
                                        for (let j = 0; j < schedule[i].competitors.length; j++) {
    
                                            let newRankingEntry = {
                                                competitor: schedule[i].competitors[j].competitor,
                                                result: schedule[i].competitors[j].result
                                            }
    
                                            finalRankings.push(newRankingEntry);
    
                                        }
    
                                    }
    
                                    else if (numOfRounds > 1) {
    
                                        for (let j = 0; j < schedule[i].competitors.length; j++) {
    
                                            let found: boolean = false;
    
                                            for (let k = 0; k < finalRankings.length; k++)
                                                if (finalRankings[k].competitor == schedule[i].competitors[j].competitor)
                                                    found = true;
    
                                            if (!found) {
    
                                                let newRankingEntry = {
                                                    competitor: schedule[i].competitors[j].competitor,
                                                    result: schedule[i].competitors[j].result
                                                }
        
                                                finalRankings.push(newRankingEntry);
    
                                            }
    
                                            else {
    
                                                for (let k = 0; k < finalRankings.length; k++)
                                                    if (finalRankings[k].competitor == schedule[i].competitors[j].competitor) {
    
                                                        if (scoreFormat == 'points') {
    
                                                            finalRankings[k].result += schedule[i].competitors[j].result;
    
                                                        }
    
                                                        else if (scoreFormat == 'distance') {
    
                                                            if (schedule[i].competitors[j].result > finalRankings[k].result)
                                                                finalRankings[k].result = schedule[i].competitors[j].result;
    
                                                        }
    
                                                        else {
    
                                                            if (schedule[i].competitors[j].result < finalRankings[k].result)
                                                                finalRankings[k].result = schedule[i].competitors[j].result;
    
                                                        }
                                                    }
    
    
                                            }
    
                                        }
    
                                    }
    
                                }
    
                            }
    
                            // sort qual rankings 
    
                            finalRankings.sort ((a, b) => {
    
                                if (a.result < b.result && (scoreFormat == 'points' || scoreFormat == 'distance')) return 1;
                                else if (a.result < b.result && !(scoreFormat == 'points' || scoreFormat == 'distance')) return -1;
                                else if (a.result > b.result && (scoreFormat == 'points' || scoreFormat == 'distance')) return -1;
                                else if (a.result > b.result && !(scoreFormat == 'points' || scoreFormat == 'distance')) return 1;
                                else return 0;
    
                            })

                            

                            // check for extra round and set positions

                            let extraRound: boolean = false;

                            let curPosition = 1;

                            for (let i = 0; i < finalRankings.length; i++) {

                                if (category == 'I') {

                                    for (let j = 0; j < competitionObj.participants.length; j++) {

                                        if (finalRankings[i].competitor == competitionObj.participants[j].fullname) {

                                            competitionObj.participants[j].finalResult = finalRankings[i].result;

                                            if (i == 0 || (i > 0 && finalRankings[i].result != finalRankings[i - 1].result)) {
                                                
                                                curPosition = i + 1;
                                                competitionObj.participants[j].finalPosition = curPosition;

                                            }

                                            else if (i > 0 && finalRankings[i].result == finalRankings[i - 1].result) {

                                                competitionObj.participants[j].finalPosition = curPosition;

                                            }
                                            
                                            break;

                                        }

                                    }

                                }

                                else if (category == 'T') {

                                    for (let j = 0; j < competitionObj.teams.length; j++) {

                                        if (finalRankings[i].competitor == competitionObj.teams[j].country) {

                                            competitionObj.teams[j].finalResult = finalRankings[i].result;
                                            
                                            if (i == 0 || (i > 0 && finalRankings[i].result != finalRankings[i - 1].result)) {
                                                
                                                curPosition = i + 1;
                                                competitionObj.teams[j].finalPosition = curPosition;

                                            }

                                            else if (i > 0 && finalRankings[i].result == finalRankings[i - 1].result) {

                                                competitionObj.teams[j].finalPosition = curPosition;

                                            }
                                            
                                            break;
                                            
                                        }

                                    }

                                }

                                if (i < finalRankings.length - 1 && finalRankings[i].result == finalRankings[i + 1].result)
                                    extraRound = true;

                            }

                            if (extraRound) {

                                // generate extra event

                                for (let i = 0; i < schedule.length; i++) {

                                    if (schedule[i].phase == round) {

                                        let scheduleObj = {
    
                                            startDateTime: schedule[i].startDateTime,
                                            location: schedule[i].location,
                                            phase: 'E',
                                            group: 'Extra round',
                                            confirmed: true,
                                            canAssign: true,
                                            completed: false,
                                            competitors: [{}]
                    
                                        }
    
                                        scheduleObj.competitors.pop ();

                                        for (let j = 0; j < finalRankings.length; j++) {

                                            if (j < finalRankings.length - 1 && j > 0 && (finalRankings[j].result == finalRankings[j + 1].result
                                                || finalRankings[j].result == finalRankings[j - 1].result)) {

                                                let newCompetitor = {
                                                    competitor: finalRankings[j].competitor,
                                                    result: ''
                                                }
        
                                                scheduleObj.competitors.push (newCompetitor);
                                            }

                                            else if (j == 0 && finalRankings[j].result == finalRankings[j + 1].result) {

                                                let newCompetitor = {
                                                    competitor: finalRankings[j].competitor,
                                                    result: ''
                                                }
        
                                                scheduleObj.competitors.push (newCompetitor);
                                            }

                                            else if (j == finalRankings.length - 1 && finalRankings[j].result == finalRankings[j - 1].result) {

                                                let newCompetitor = {
                                                    competitor: finalRankings[j].competitor,
                                                    result: ''
                                                }
        
                                                scheduleObj.competitors.push (newCompetitor);
                                            }

                                            
                                        
                                        }
    
                                        competitionObj.schedule.push (scheduleObj);

                                    }

                                }

                                competitionObj.round = 'E';

                            }

                            else
                                competitionObj.canComplete = true;

                        }

                    }

                }

                else if (round == 'E') {

                    for (let i = 0; i < schedule.length; i++) {

                        if (schedule[i].phase == round) {

                            // find positions to be determined and rank competitors

                            let extraCompetitors:any[] = [];

                            for (let j = 0; j < schedule[i].competitors.length; j++) {

                                //let 

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

            //competitionForUpdate.schedule = schedule;

            const competitionReturn = await Competition.findOneAndUpdate ({'sport': sport, 'discipline': discipline, 'gender': gender}, competitionForUpdate).exec();

            res.json (competitionForUpdate);

        }

    }

    finnishCompetition = async (req: express.Request, res: express.Response) => {

        // finnish competition and assign medals

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
        let category = req.body.category;
        let numOfRounds = req.body.numOfRounds;
        let schedule = req.body.schedule;
        let scoreFormat = req.body.scoreFormat;

        let participants = req.body.participants;

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

                competitionObj.status = 'C';

                if (category == 'I') {

                    for (let i = 0; i < competitionObj.participants.length; i++) {

                        if (competitionObj.participants[i].finalPosition != undefined && competitionObj.participants[i].finalPosition <= 3) {

                            let name = competitionObj.participants[i].fullname.split(', ');

                            let part = await Participant.findOneAndUpdate({'firstname': name[1], 'lastname': name[0], 'gender': gender, 'sport': sport}, {$inc : {'medals' : 1}}).exec();

                            let partObj = part.toObject({getters: true});
                            let country;
                            
                            if (competitionObj.participants[i].finalPosition == 1)
                                country = await Country.findOneAndUpdate ({'abbr': partObj.country}, {$inc : {'numOfGoldMedals' : 1}}).exec();

                            else if (competitionObj.participants[i].finalPosition == 2)
                                country = await Country.findOneAndUpdate ({'abbr': partObj.country}, {$inc : {'numOfSilverMedals' : 1}}).exec();

                            else if (competitionObj.participants[i].finalPosition == 3)
                                country = await Country.findOneAndUpdate ({'abbr': partObj.country}, {$inc : {'numOfBronzeMedals' : 1}}).exec();

                        }
                    
                    }

                }

            }

            competitionForUpdate = competitionObj;

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