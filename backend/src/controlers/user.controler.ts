import express from 'express';
import { Utils } from '../utils/utils';
import User from '../models/user';

export class UserControler {

    login = async (req: express.Request, res: express.Response) => {

        let username = req.body.username;
        let password = req.body.password;

        /*User.findOne({'username': username, 'password': password}, (err, user) => {
            if (err) console.log (err);
            else
                res.json(user);
        })*/

        const user = await User.findOne({'username': username, 'password': password});
        res.json (user);

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

                let passwordCheck = new Utils().passwordCheck(password);

                if (passwordCheck.errorFound) {

                    errorFound = true;
                    errorReport.passwordRules = passwordCheck.passwordRules;

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
                        approved: false,
                        numOfCompetitions: 0
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

    changePassword = (req: express.Request, res: express.Response) => {

        let username = req.body.username;
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        User.findOne({'username': username, 'password': oldPassword}, (err, user) => {

            if (err) console.log (err);
            else {

                if (user) {

                    let errorFound = false;
                    let errorReport = {
                        message: 'Errors found',
                        passwordRules: ''
                    };

                    let passwordCheck = new Utils().passwordCheck(newPassword);

                    if (passwordCheck.errorFound) {

                        errorFound = true;
                        errorReport.passwordRules = passwordCheck.passwordRules;

                    }

                    if (errorFound)
                        return res.json(errorReport);

                    else {

                        User.findOneAndUpdate({'username': username, 'password': oldPassword}, {password: newPassword}, (err, user) => {

                            if (err) console.log (err);
                            else if (user)
                                return res.json ({'message': 'Password updated'});
                            else res.json ({'message': 'Something went wrong'});

                        })
                    }

                }

                else
                    return res.json({'message': 'No user found with provided credentials'});

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

    getAvailableDelegates = (req: express.Request, res: express.Response) => {

        User.find({'type': 'D', 'numOfCompetitions': {$lt: 3}}, (err, users) => {

            if (err) console.log (err);
            else
                res.json (users);

        });

    }

}