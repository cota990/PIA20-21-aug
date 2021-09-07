import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let record = new Schema(
    {
        year: {
            type: Number
        },

        place: {
            type: String
        },

        sport: {
            type: String
        },

        discipline: {
            type: String
        },

        participant: {
            type: String
        },

        gender: {
            type: String
        },

        country: {
            type: String
        },

        record: {
            type: String
        }
    }
);

export default mongoose.model('Record', record, 'records');