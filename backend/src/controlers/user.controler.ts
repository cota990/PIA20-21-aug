import express from 'express';
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
        
        let username = req.body.username;
        let password = req.body.password;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let country = req.body.country;
        let mail = req.body.mail;
        let type = req.body.type;

        let errorFound = false;
        let errorReport = {
            message: 'Errors found',
            mailTaken: '',
            usernameTaken: '',
            leaderExists: '',
            passwordRules: ''
        };

        // required checks: 
        //      if mail is already taken?
        //      if username is already taken?
        //      if national leader, check if already exists?
        //      password and password confirm match?
        //      check password rules

        User.find({$or: [{'mail': mail}, {'username': username}, {'country': country, 'type': type}]}, (err, users) => {

            if (err) console.log (err);

            else {

                users.forEach ( (user)  => {

                    let foundUser = user.toObject();
                    
                    if (foundUser['mail'] == mail) {
                        
                        errorFound = true;                    
                        errorReport.mailTaken = 'Provided e-mail address is already registered';
                    
                    }

                    if (foundUser['username'] == username) {
                        
                        errorFound = true;                    
                        errorReport.usernameTaken = 'Provided username is already registered';
                    
                    }

                    if (type == 'L' && foundUser['country'] == country && foundUser['type'] == type) {

                        errorFound = true;
                        errorReport.leaderExists = 'National delegation leader already registered';
                    }
                })

                if (password.length < 8 || password.length > 12) {

                    errorFound = true;
                    errorReport.passwordRules += 'Password must be between 8 and 12 characters long. ';

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
                    errorReport.passwordRules += 'Password must have at least three small letters. ';

                }

                if (capitalLettersCounter < 1) {

                    errorFound = true;
                    errorReport.passwordRules += 'Password must have at least one capital letter. ';

                }

                if (digitsCounter < 2) {

                    errorFound = true;
                    errorReport.passwordRules += 'Password must have at least two digits. ';

                }

                if (specialCharactersCounter < 2) {

                    errorFound = true;
                    errorReport.passwordRules += 'Password must have at least two special characters. ';

                }

                if (errorFound)
                    res.status(200).json(errorReport);
                
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
                        console.log (err);
                        res.status(400).json({'message': 'There was an error while processing your request. Please try again later'});
                    })
                    
                }

            }

        })

    }

    pendingRequests = (req: express.Request, res: express.Response) => {

        User.find({'approved': false}, (err, users) => {

            if (err) console.log (err);
            else
                return res.json (users);

        })
    }

    approveRequest = (req: express.Request, res: express.Response) => {

        let username = req.body.username;

        User.findOneAndUpdate({'username': username}, {'approved': true}, (err, user) => {

            if (err) console.log (err);
            else {
                
                if (user)
                    return res.status(200).json({'message': 'Account approved'});
                else
                    return res.status(200).json({'message': 'Something went wrong. Please try again later'});

            }
        });

    }

    rejectRequest = (req: express.Request, res: express.Response) => {

        let username = req.body.username;

        User.findOneAndDelete({'username': username}, (err, user) => {

            if (err) console.log (err);
            else {
                
                if (user)
                    return res.status(200).json({'message': 'Account rejected'});
                else
                    return res.status(200).json({'message': 'Something went wrong. Please try again later'});

            }
        });

    }
}