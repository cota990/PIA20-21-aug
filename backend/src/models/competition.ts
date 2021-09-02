import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let participant = new Schema (
    {
        // fullname of participant
        fullname: {
            type: String
        },

        // if participant is seeded (for tennis),and which seed
        seeded: {
            type: Number
        },

        // for competitions with series
        roundResults: {
            type: Array(String)
        },

        // finalResult: for individual competitions in required format
        finalResult: {
            type: String
        },

        // finalPosition: used for ranking and medal determination
        finalPosition: {
            type: Number
        }

    }
);

let team = new Schema({

    // country of team
    country: {
        type: String
    },

    // seed - after group stage set for knockout phase draw
    seed: {
        type: String
    },

    // finalPosition used for ranking and medal determination
    finalPosition: {
        type: Number
    },

    // group (A or B)
    group: {
        type: String
    },

    // points acquired in group stage
    groupPoints: {
        type: Number
    }

});

let competition = new Schema ({

    // sport name
    sport: {
        type: String
    },

    // sport discipline
    discipline: {
        type: String
    },

    // gender category
    gender: {
        type: String
    },

    // category: I - individual, T - team
    category: {
        type: String
    },

    // date of beggining of competition
    startDate: {
        type: String
    },

    // date of ending of competition
    endDate: {
        type: String
    },

    // locations of games
    locations: {
        type: Array
    },

    // Related people to competition

    // participants for individual sports
    participants: {
        type: Array (participant)
    },

    // participating teams for team sports
    teams: {
        type: Array (team)
    },

    // list of assigned delegates' usernames
    delegates: {
        type: Array(String)
    },

    // Competition format information

    // format of results
    scoreFormat: {
        type: String
    },

    // allowed result values
    allowedResults: {
        type: String
    },

    // determines phases: F - only one event (Finals), K - knockout stage, G - group + knockout stage
    phases: {
        type: String
    },

    // for sports rounds or series (group stages, athletics jump and throw disciplines, shooting)
    numOfRounds: {
        type: Number
    }

    // Schedule TODO

    // Scores TODO


});

export default mongoose.model ('Competition', competition, 'competitions');