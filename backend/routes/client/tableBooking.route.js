const express = require('express')
const tableBookingcontroller = require('../../Controllers/client/tableBooking.controller')
const router = express.Router()


router.post('/create', tableBookingcontroller.createBooking)


module.exports = router;