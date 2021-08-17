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
        //      check password rules

        User.find({$or: [{'mail': mail}, {'username': 'username'}, {'country': country, 'type': type}]}, (err, users) => {

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

                //let passwordRegex = "^(?=.*[a-z]{3,})(?=.*[A-Z])(?=.*\d{2,})(?=.*[@$!%*?&]{2,})[A-Za-z\d@$!%*?&]{8,12}$";
                let passwordRegexLength = new RegExp ("^[A-Za-z0-9@$!%*?&]{8,12}$");
                //let passwordRegexLength = new RegExp ("(?=.{8,12})");

                if (!passwordRegexLength.test(password)) {
                    errorFound = true;
                    errorReport.passwordRules += 'Password must be between 8 and 12 characters long. ';
                }

                let passwordRegexNumOfCapitals = new RegExp ("(?=.*[A-Z])");

                if (!passwordRegexNumOfCapitals.test(password)) {
                    errorFound = true;
                    errorReport.passwordRules += 'Password must have at least one capital letter. ';
                }

                let passwordRegexNumOfSmallLetters = new RegExp ("(?=.*[a-z]){3,}");

                if (!passwordRegexNumOfSmallLetters.test(password)) {
                    errorFound = true;
                    errorReport.passwordRules += 'Password must have at least three small letters. ';
                }

                let passwordRegexNumOfDigits = new RegExp ("(?=.*[0-9]){2,}");

                if (!passwordRegexNumOfDigits.test(password)) {
                    errorFound = true;
                    errorReport.passwordRules += 'Password must have at least two digits. ';
                }

                let passwordRegexNumOfSpecialCharacters = new RegExp ("(?=.*[@$!%*?&]){2,}");

                if (!passwordRegexNumOfSpecialCharacters.test(password)) {
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
}