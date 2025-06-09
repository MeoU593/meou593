const express = require('express')
const controller = require('../../Controllers/client/user.controller') 
const Otpcontroller = require('../../Controllers/client/Otp.controller')

const authenticateToken   = require('../../middlewares/authUser.middleware')


const router = express.Router()

router.get('/list', controller.getUsers)

router.get('/detail' ,authenticateToken, controller.getUser)

router.patch('/edit' ,authenticateToken ,controller.updateUser)

router.post('/register' , controller.register)

router.post('/login' , controller.login)

router.get('/logout',authenticateToken, controller.logout)

router.post('/requestOtp', Otpcontroller.requestOtp)

router.post('/verifyOtp',Otpcontroller.VerifyOtpController)

router.get('/orders',authenticateToken, controller.getOrdersByUser)


module.exports = router;