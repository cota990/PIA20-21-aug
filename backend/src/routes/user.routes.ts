import express from 'express';
import { UserControler } from '../controlers/user.controler';

const userRouter = express.Router();

userRouter.route('/login').post(
    (req, res) => new UserControler().login(req, res)
);

userRouter.route('/register').post(
    (req, res) => new UserControler().register(req, res)
);

userRouter.route('/pendingRequests').get(
    (req, res) => new UserControler().pendingRequests(req, res)
);

userRouter.route('/approveRequest').post(
    (req, res) => new UserControler().approveRequest(req, res)
);

userRouter.route('/rejectRequest').post(
    (req, res) => new UserControler().rejectRequest(req, res)
);

userRouter.route('/getAvailableDelegates').get(
    (req, res) => new UserControler().getAvailableDelegates(req, res)
);

export default userRouter;