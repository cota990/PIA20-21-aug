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

    }
}