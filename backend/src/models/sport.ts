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
    },

    // added to current olympics by organizer
    currentInOlympics: {
        type: Boolean
    },

    // format of competition metadata

    // format of scores input: match (poeni_tim1 : poeni_tim2), short race (ss:tt), medium race (mm:ss:tt), long race (hh:mm:ss), jump/throw (m,cm), num (number)
    scoreFormat: {
        type: String
    },

    // list of allowed values for results
    allowedResults: {
        type: Array(String)
    }

});

export default mongoose.model ('Sport', sport, 'sports');