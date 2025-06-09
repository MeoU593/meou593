const express = require('express')
const controller = require('../../Controllers/admin/delivery.controller')
const router = express.Router()


router.get('/orders',controller.getOrders)

router.get('/orders/:orderCode',controller.getOrder)


module.exports = router;