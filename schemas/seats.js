const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const { Schema } = mongoose

const seatsSchema = new Schema({
  name: { type: String, required: true, lowercase: true, trim: true, unique: true},
  seats: [
    { 
        row: Number,
        column: Number,
        type: String,
        available: Boolean        
 }],
  

})

const Seats = mongoose.model('Seats', seatsSchema)

module.exports = Seats
