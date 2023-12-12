const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const { Schema } = mongoose

const theaterSchema = new Schema({
  name: { type: String, required: true, lowercase: true, trim: true, unique: true},
  seats: [
    { 
        row: Number,
        column: Number,
        type: String,
        available: Boolean        
 }],
  

})

const Theater = mongoose.model('Theater', theaterSchema)

module.exports = Theater
