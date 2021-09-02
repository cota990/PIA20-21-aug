import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let location = new Schema ({

    // name of location
    name: {
        type: String
    },

    // list of sports that can be played in that location
    sports: {
        type: Array(String)
    }
    
});

export default mongoose.model('Location', location, 'locations');