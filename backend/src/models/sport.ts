import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let sport = new Schema ({

    // name of the sport
    name: {
        type: String
    },

    // name of the sport discpline
    discipline: {
        type: String
    },

    // type of sport discpline: I - individual, T - team
    type: {
        type: String
    },

    // maximum of allowed players for team sports
    maxPlayers: {
        type: Number
    },

    // minimum of allowed players for team sports
    minPlayers: {
        type: Number
    }
});

export default mongoose.model ('Sport', sport, 'sports');