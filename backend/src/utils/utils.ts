import { Document } from "mongoose";
import Participant from "../models/participant";
import Sport from "../models/sport";

export class Utils {

    passwordCheck = (password: string) => {

        let errorFound: boolean = false;
        let passwordRules: string = '';

        if (password.length < 8 || password.length > 12) {

            errorFound = true;
            passwordRules += 'Password must be between 8 and 12 characters long. ';

        }

        let smallLettersCounter = 0;
        let capitalLettersCounter = 0;
        let digitsCounter = 0;
        let specialCharactersCounter = 0;

        let smallLetterRegex = new RegExp ('[a-z]');
        let capitalLetterRegex = new RegExp ('[A-Z]');
        let digitRegex = new RegExp ('[0-9]');
        let specialCharRegex = new RegExp ('[!@#$%^&*]');

        for (let i = 0; i < password.length; i++) {

            let character = password.charAt (i);

            if (smallLetterRegex.test(character))
                smallLettersCounter++;
            if (capitalLetterRegex.test(character))
                capitalLettersCounter++;
            if (digitRegex.test(character))
                digitsCounter++;
            if (specialCharRegex.test(character))
                specialCharactersCounter++;

        }

        if (smallLettersCounter < 3) {

            errorFound = true;
            passwordRules += 'Password must have at least three small letters. ';

        }

        if (capitalLettersCounter < 1) {

            errorFound = true;
            passwordRules += 'Password must have at least one capital letter. ';

        }

        if (digitsCounter < 2) {

            errorFound = true;
            passwordRules += 'Password must have at least two digits. ';

        }

        if (specialCharactersCounter < 2) {

            errorFound = true;
            passwordRules += 'Password must have at least two special characters. ';

        }

        let returnData = {
            errorFound: errorFound,
            passwordRules: passwordRules
        }

        return returnData;

    }

    checkForTeamDisciplines = async (disciplines: string[], country: string, gender: string, sport: string): Promise<{proceed: boolean, report: string, disciplines: string[]}> => {

        let teamDisciplines: string[] = [];
        let maxPlayersArray: number[] = [];

        const sports = await Sport.find({'type': 'T'}).exec();

        sports.forEach ((sport) => {
                        
            let foundSport = sport.toObject({ getters: true });

            if (disciplines.indexOf (foundSport.discipline) >= 0) {
                // perform check

                teamDisciplines.push (foundSport.discipline);
                maxPlayersArray.push (foundSport.maxPlayers);
            }
        
        })

        let data = {
            proceed: true,
            report: '',
            disciplines: teamDisciplines
        };

        if (teamDisciplines.length > 0) {

            // found team disciplines; find all participants in all disciplines
            const participants = await Participant.find({'country': country, 'gender': gender, 'sport': sport, 'disciplines': {$in: teamDisciplines}}).exec();

            let errFound = false;
            let report = 'Following disciplines already have maximum players allowed: ';

            let i = 0;

            for (i = 0; i < teamDisciplines.length; i = i + 1) {

                let cnt = 0;

                participants.forEach ((part) => {

                    let partObj = part.toObject({ getters: true });

                    if (partObj.disciplines.indexOf(teamDisciplines[i]) >= 0)
                        cnt++;
                })

                if (cnt >= maxPlayersArray[i]) {

                    errFound = true;
                    report += teamDisciplines[i] + ', ';

                }
            
            }

            if (errFound) {

                report = report.slice(0, report.length - 2);
                data.proceed = false;
                data.report = report;

            }

            else {

                data.report = 'Completed';
            }

        }

        else {

            data.report = 'Completed';
        }


        /*const doQuery = await Sport.find({'type': 'T'}).exec().then((sports) => {

            let teamDisciplines: String[] = [];
            let maxPlayersArray: Number[] = [];

            sports.forEach ((sport) => {
                            
                let foundSport = sport.toObject({ getters: true });

                if (disciplines.indexOf (foundSport.discipline) >= 0) {
                    // perform check

                    teamDisciplines.push (foundSport.discipline);
                    maxPlayersArray.push (foundSport.maxPlayers);
                }
            
            })

            if (teamDisciplines.length > 0) {

                // found team disciplines; find all participants in all disciplines
                Participant.find({'country': country, 'gender': gender, 'sport': sport, 'disciplines': {$in: teamDisciplines}}, (err, p) => {

                    if (err) {
                        
                        console.log (err);
                        data.report = 'Error in db';
                        data.proceed = false;
        
                    }

                    else {

                        // must order received participants by discipline

                        let errFound = false;
                        let report = 'Following disciplines already have maximum players allowed: ';

                        let i = 0;

                        for (i = 0; i < teamDisciplines.length; i = i + 1) {

                            let cnt = 0;

                            p.forEach ((part) => {

                                let partObj = part.toObject({ getters: true });

                                if (partObj.disciplines.indexOf(teamDisciplines[i]) >= 0)
                                    cnt++;
                            })

                            if (cnt >= maxPlayersArray[i]) {

                                errFound = true;
                                report += teamDisciplines[i] + ', ';

                            }
                        
                        }

                        if (errFound) {

                            report = report.slice(0, report.length - 2);
                            data.proceed = false;
                            data.report = report;

                        }

                        else {

                            data.report = 'Completed';
                        }

                    }

                });

            }
            
        }).catch ((err) => {

            console.log (err);
            data.report = 'Error in db';
            data.proceed = false;
        }); */

        //console.log (doQuery);

        console.log (data);

        return data;

    }
 
}