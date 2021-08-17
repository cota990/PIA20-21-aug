import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let country = new Schema({

});

export default mongoose.model('Country', country, 'countries');