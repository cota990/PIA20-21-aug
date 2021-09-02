import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let user = new Schema ({

    // username for login
    username: {
        type: String
    },

    // password for login
    password: {
        type: String
    },

    // firstname of user
    firstname: {
        type: String
    },

    // lastname of user 
    lastname: {
        type: String
    },

    // country of user
    country: {
        type: String
    },

    // registered e-mail of user
    mail: {
        type: String
    },

    // type of user: O - organizer, D - delegate, L - national delegation leader
    type: {
        type: String
    },

    // whether user account is approved by organizer
    approved: {
        type: Boolean
    },

    // numOfCompetitions (for delegates)
    numOfCompetitions: {
        type: Number
    }

})

export default mongoose.model('User', user, 'users');