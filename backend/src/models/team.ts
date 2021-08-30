import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let team = new Schema({

    // country of the team
    country: {
        type: String
    },

    // gender category of the team
    gender: {
        type: String
    },

    // sport of team
    sport: {
        type: String
    },

    // discipline of team
    discipline: {
        type: String
    },

    // number of currently signed in players
    numOfPlayers: {
        type: Number
    },

    // status of team: S - signed up but not complete (does not have minimum ammount of players), C - complete (has at least minimum ammount of players)
    status: {
        type: String
    }

});

export default mongoose.model('Team', team, 'teams');