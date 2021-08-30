import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let participant = new Schema({

    // firstname of participant
    firstname: {
        type: String
    },

    // lastname of participant
    lastname: {
        type: String
    },

    // fullname of participant
    fullname: {
        type: String
    },

    // gender of participant
    gender: {
        type: String
    },

    // country of participant
    country: {
        type: String
    },

    // sport name of participant
    sport: {
        type: String
    },

    // sport disciplines of participant
    disciplines: {
        type: Array
    }

});

export default mongoose.model('Participant', participant, 'participants');