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

        // for competitions in qualification + finals format
        qualificationGroup: {
            type: String
        },


        // for competitions in qualification + finals format
        qualificationResult: {
            type: String
        },

        // for competitions in qualification + finals format
        qualificationPosition: {
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

let competitorResult = new Schema (
    {
        // name of participant/ name of country
        competitor: {
            type: String
        },

        // result achieved
        result: {
            type: String
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

    // finalResult: for team competitions in required format
    finalResult: {
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
    },

    // for competitions in qualification + finals format
    qualificationGroup: {
        type: String
    },


    // for competitions in qualification + finals format
    qualificationResult: {
        type: String
    },

    // for competitions in qualification + finals format
    qualificationPosition: {
        type: Number
    }

});

let schedule = new Schema ({

    // date and time of event
    startDateTime : {
        type: String
    },

    // location of event
    location : {
        type: String
    },

    // if delegate confirmed location and start
    confirmed: {
        type: Boolean
    },

    // if delegate can assign date and location
    canAssign: {
        type: Boolean
    },

    // if this event is completed
    completed: {
        type: Boolean
    },

    // phase of competition
    phase : {
        type: String
    },

    // qualification group/group stage group
    group: {
        type: String
    },

    // for group stages/ sports with series
    round: {
        type: String
    },

    // for team matches
    team1: {
        type: String
    },

    team2: {
        type: String
    },

    // for individual matches
    participant1: {
        type: String
    },

    participant2: {
        type: String
    },

    // for individual disciplines
    competitors: {
        type: Array(competitorResult)
    },

    result: {
        type: String
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

    //status of competition: O - organizer started, but delegate did not set schedule, D - delegate started schedule (but not finnished), C - completed with all scores
    status: {
        type: String
    },

    // if this event can be finnished by delegate
    canComplete: {
        type: Boolean
    },

    // round: current round of competition: number for group stage round, R16, QF, SF for knockout stages, Q, for qualification, F for finals

    round: {
        type: String
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
        type: Array(String)
    },

    // determines phases: F - only one event (Finals), K - knockout stage, G - group + knockout stage
    phases: {
        type: String
    },

    // for sports rounds or series (group stages, athletics jump and throw disciplines, shooting)
    numOfRounds: {
        type: Number
    },

    // Schedule TODO
    schedule: {
        type: Array(schedule)
    }

    // Scores TODO


});

export default mongoose.model ('Competition', competition, 'competitions');