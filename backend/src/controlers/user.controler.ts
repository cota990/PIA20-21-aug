import express from 'express';
import user from '../models/user';
import User from '../models/user';

export class UserControler {

    login = (req: express.Request, res: express.Response) => {

        let username = req.body.username;
        let password = req.body.password;

        User.findOne({'username': username, 'password': password}, (err, user) => {
            if (err) console.log (err);
            else
                res.json(user);
        })

    }

    register = (req: express.Request, res: express.Response) => {

        // required checks: 
        //      if mail is already taken?
        //      if username is already taken?
        //      if national leader, check if already exists?
        //      check password rules

        let username = req.body.username;
        let password = req.body.password;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let country = req.body.country;
        let mail = req.body.mail;
        let type = req.body.type;

        let errorFound = false;
        let errorReport = {
            mailTaken: '',
            usernameTaken: '',
            leaderExists: '',
            passwordRules: ''
        };

        User.findOne({'mail': mail}, (err, user) => {
            if (err) console.log (err);
            else {

                console.log (user);
                if (!user) {

                    errorFound = true;
                    errorReport.mailTaken = 'Provided e-mail address is already registered';

                }
            }
        })

        User.findOne({'username': username}, (err, user) => {
            if (err) console.log (err);
            else {
                console.log (user);
                if (!user) {

                    errorFound = true;
                    errorReport.usernameTaken = 'Provided username is already registered';
                }
            }
        })

        if (type == 'L') {

            User.findOne({'country': country, 'type': type}, (err, user) => {

                if (err) console.log (err);
                else {
                    console.log (user);
                    if (!user) {

                        errorFound = true;
                        errorReport.leaderExists = 'National delegation leader is already registered for this country';
                    }
                }
            })
        }

        //let passwordRegex = "^(?=.*[a-z]{3,})(?=.*[A-Z])(?=.*\d{2,})(?=.*[@$!%*?&]{2,})[A-Za-z\d@$!%*?&]{8,12}$";
        let passwordRegexLength = new RegExp ("^[A-Za-z\d@$!%*?&]{8,12}$");

        if (!passwordRegexLength.test(password)) {
            errorFound = true;
            errorReport.passwordRules += 'Password must be between 8 and 12 characters long';
        }

        if (errorFound)
            res.json(errorReport);
        
        else {

            let user = new User({
                username: username,
                password: password,
                firstname: firstname,
                lastname: lastname,
                country: country,
                mail: mail,
                type: type,
                approved: false
            });

            user.save().then((user) => {
                res.status(200).json({'message': 'Request is being processed; awaiting confirmation'});
            }
            ).catch((err) => {
                res.status(400).json({'message': 'There was an error while processing your request. Please try again later'});
            })
            
        }

    }
}