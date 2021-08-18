import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let country = new Schema({

    // full name of country
    name: {
        type: String
    },

    // three letter abbreviation for country
    abbr: {
        type: String
    },

    // path to flag picture in frontend
    flag: {
        type: String
    },

    // number of Olympics participants
    numOfParticipants: {
        type: Number
    },

    // number of gold medals
    numOfGoldMedals: {
        type: Number
    },

    // number of silver medals
    numOfSilverMedals: {
        type: Number
    },

    // number of bronze medals
    numOfBronzeMedals: {
        type: Number
    }

});

export default mongoose.model('Country', country, 'countries');