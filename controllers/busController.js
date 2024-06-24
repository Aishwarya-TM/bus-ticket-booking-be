const busData = require('../data/busData')
const busModel = require('../models/busModel')
const seatData = require('../data/seatData')
const seatModel = require('../models/seatModel')

const getAllBuses = async (request, response) => {
    let buses = await busModel.find().select(' -_id -__v')

    if (buses.length == 0) {
        await busModel.insertMany(busData)
        buses = await busModel.find().select(' -_id -__v')
    }
    response.status(200).json(buses)
}

const getAllSeats = async (request, response) => {
    let seats = await seatModel.find()

    if (seats.length == 0) {
        await seatModel.insertMany(seatData)
        seats = await seatModel.find()
    }
    response.status(200).json(seats)
}

const searchBusesByID = async (request, response) => {
    const { busId } = request.params

    try {
        let bus = await busModel.findOne({ _id: busId }).select('-_id -__v')

        if (!bus || bus.length === 0) {
            return response.status(404).send({ message: "Bus not found" })
        }

        return response.status(200).send(bus)

    }
    catch (error) {
        return response.status(500).send({ message: error.message })
    }
}

const searchBusesByOperator = async (request, response) => {
    const { operator } = request.params

    try {
        const formattedCategory = operator.replace(/[\s-]/g, '[-\\s]?')
        const regexPattern = new RegExp(formattedCategory, 'i')

        const buses = await busModel.find({ travelsName: regexPattern }).select('-_id -__v')


        if (!buses || buses.length === 0) {
            return response.status(404).send({ message: "No buses found for the operator" })
        }

        return response.status(200).json(buses)


    }
    catch (error) {
        return response.status(500).json({ message: error.message })
    }
}

const searchBusesByBusTypes = async (request, response) => {
    const { busType } = request.params

    try 
    {
        const regexPattern = new RegExp(`^${busType}$`, 'i')

        const buses = await busModel.find({ busType: { $regex: regexPattern } }).select('-_id -__v')


        if (!buses || buses.length === 0) {
            return response.status(404).send({ message: "BusType not found!" })
        }
        return response.status(200).json(buses)
    }

    catch (error) {
        return response.status(500).json({ message: error.message })
    }
}

const searchBusesByBusCategory = async (request, response) => {
    const { busCategory } = request.params;

    try 
    {
        const regexPattern = new RegExp(`^${busCategory}$`, 'i')

        const buses = await busModel.find({ busCategory: { $regex: regexPattern } }).select('-_id -__v')

        if (!buses || buses.length === 0) {
            return response.status(404).send({ message: "BusCategory not found!" });
        }

        return response.status(200).json(buses);
    } 
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}


const bookSeats = async (request, response) => {
    const { busId } = request.params;
    const { dateToBook, seatNumbers, source, destination } = request.body

    try {
        console.log(busId, dateToBook, source, destination, seatNumbers)
        const bus = await busModel.findById({ _id: busId })


        if (!bus) {
            return response.status(404).json({ message: 'Bus not found for the given date or source' })
        }


        const travelDate = bus.date.toISOString()
        if (travelDate !== dateToBook || bus.source !== source || bus.destination !== destination) {
            return response.status(400).json({ message: 'Invalid date or source or destination' })
        }


        const seatInfo = await seatModel.findOne({ busId: busId })


        if (!seatInfo) {
            return response.status(404).json({ message: 'Seats information not found for the given bus and date' })
        }

        let totalCost = 0;
        const bookedSeats = [];

        for (const seatNumber of seatNumbers) {
            const seat = seatInfo.seats.find(s => s.seatNumber === seatNumber)

            if (!seat) {
                return response.status(404).json({ message: `Seat ${seatNumber} not found on the bus ` })
            }

            if (seat.booked) {
                return response.status(409).json({ message: `Seat ${seatNumber} is already booked` })
            }

            seat.booked = true
            totalCost += seat.price
            bookedSeats.push(seatNumber)
        }

        await seatInfo.save();

        return response.status(200).json({
            message: 'Seats booked successfully',
            source,
            destination,
            bookedSeats,
            totalCost
        })

    } catch (error) {
        console.error('Error booking seats:', error);
        return response.status(500).send({ message: 'Internal server error' })
    }
}


module.exports = { getAllBuses, getAllSeats, searchBusesByID, searchBusesByOperator, searchBusesByBusTypes, searchBusesByBusCategory, bookSeats }