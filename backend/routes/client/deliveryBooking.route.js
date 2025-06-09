const express = require('express')
const deliveryBookingcontroller = require('../../Controllers/client/deliveryBooking.controller')
const router = express.Router()
const authorizeRoles = require('../../middlewares/authRoles.middleware');
const authenticateToken = require('../../middlewares/authUser.middleware');


// CỦA NGƯỜI DÙNG
router.post('/book',authenticateToken ,deliveryBookingcontroller.createDeliveryOrder)



// BÊN NHÀ HÀNG
router.patch('/confirm', authorizeRoles(['admin','delivery', 'staff']), deliveryBookingcontroller.confirmDeliverySuccess)

router.get('/list', authorizeRoles(['admin','delivery','staff']), deliveryBookingcontroller.getallBookings)

module.exports = router;