const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const { Schema } = mongoose

const theaterSchema = new Schema({
    name: { type: String, required: true, lowercase: true, trim: true, unique: true },
    seats: [
        {
            row: { type: String, required: true },
            column: { type: String, required: true },
            type: { type: String, enum: ['general', 'platea_baja', 'platea_alta'] }, // Ejemplo de tipos de asientos
            available: { type: Boolean, default: true }
        }
    ]
});



const Theater = mongoose.model('Theater', theaterSchema)

module.exports = Theater
