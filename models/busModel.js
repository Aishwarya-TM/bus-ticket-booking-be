const mongoose = require('mongoose')

const busSchema = new mongoose.Schema({
    travelsName: {
        type: String,
        required: true,
        unique: true,
        enum: ['KPN Travels','GTS Travels', 'Arun Travels','TGS Travels','SRS Travels','RKS Travels','PGA Travels','MGK Travels','Kevin Travels','Venus Travels','KG Travels','MV Travels']
        
    },
    source: {
        type: String,
        required: true,
        enum: ['Chennai', 'Coimbatore', 'Trichy', 'Madurai']
    },
    destination: {
        type: String,
        required: true,
        enum: ['Chennai', 'Coimbatore', 'Trichy', 'Madurai']
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    busType: {
        type: String,
        enum: ['AC', 'Non-AC'], 
        required: true
    },
    busCategory: {
        type: String,
        enum: ['Semi-Sleeper', 'Sleeper'], 
        required: true
    }
},
{
    collection: "busTicketBooking"
})

module.exports = mongoose.model('busTicketBooking', busSchema)