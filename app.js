const {DB_URI, PORT} = require('./configuration/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const busRouter = require('./routes/busRouter')
const userRouter = require('./routes/userRouter')

app.use(express.json())

app.get('/',(request, response) =>
{
    response.status(200).send({message: "Server is running"})
})

mongoose.connect(DB_URI)
const db = mongoose.connection
db.on('error', (errorMessage) => console.log(errorMessage))
db.once('open', () => console.log('Connected to db successfully!'))

app.use('/api/v1/busTicketBooking', busRouter)
app.use('/api/v1/busTicketBooking/user', userRouter)


app.listen(PORT, () =>
{
    console.log(`server is running at http://localhost:${PORT}`)
})
