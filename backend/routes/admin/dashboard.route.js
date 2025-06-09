const express = require('express')
const controller = require('../../Controllers/admin/dashboard.controller')
const router = express.Router()


router.get('/',controller.index)

router.get('/total-revenue',controller.totalRevenue)

router.get('/total-dishes',controller.totalDishes)

router.get('/total-orders',controller.totalOrders)

router.get('/get-order/:orderCode',controller.getOrder)

router.patch('/change-status/:orderCode',controller.changeStatus)


module.exports = router;