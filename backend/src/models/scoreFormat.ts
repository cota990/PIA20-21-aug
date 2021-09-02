import mongoosee from 'mongoose';

const Schema = mongoosee.Schema;

let scoreFormat = new Schema({

    // type of format
    type: {
        type: String
    },

    // basic format string
    format: {
        type: String
    },

    // description of score format
    description: {
        type: String
    }

});

export default mongoosee.model('ScoreFormat', scoreFormat, 'scoreFormats');