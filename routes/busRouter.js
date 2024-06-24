const express = require('express')
const { getAllBuses, getAllSeats, searchBusesByID, searchBusesByOperator, searchBusesByBusTypes, searchBusesByBusCategory, bookSeats } = require('../controllers/busController')
const router = express.Router()

router.get('/buses', getAllBuses)

router.get('/seats', getAllSeats)

router.get('/search/buses/:busId',searchBusesByID)

router.get('/search/busOperator/:operator', searchBusesByOperator)

router.get('/search/busType/:busType', searchBusesByBusTypes)

router.get('/search/busCategory/:busCategory', searchBusesByBusCategory)

router.post('/buses/book/:busId',bookSeats)


module.exports = router