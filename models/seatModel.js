const mongoose = require('mongoose')

const seatSchema = new mongoose.Schema({
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'busTicketBooking',
        required: true
    },

    seats: [{
        seatNumber: {
            type: String,
            required: true,
            enum: ['LL1', 'LL2', 'LL3', 'LL4', 'LL5', 'LU1', 'LU2', 'LU3', 'LU4', 'LU5', 'RU1', 'RU2', 'RU3', 'RU4', 'RU5', 'RL1', 'RL2', 'RL3', 'RL4', 'RL5']
        },
        price: {
            type: Number,
            required: true
        },

        booked: {
            type: Boolean,
            default: false
        }
    }]

},
{
    collection: "seatModel",
})

module.exports = mongoose.model('seatModel', seatSchema)