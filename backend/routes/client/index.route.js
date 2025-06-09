const userRoute = require('./user.route')
const homeRoute = require('./home.route')
const menuRoute = require('./menu.route')
const cartRoute = require('./cart.route')
const orderRoute = require('./order.route')
const tableRoute = require('./tableBooking.route')
const deliveryRouter = require("./deliveryBooking.route")

const  authenticateToken  = require('../../middlewares/authUser.middleware')
const authenticateTableBooking = require("../../middlewares/tableBooking.middleware")

module.exports = (app) => {
    // const PATHversion1 = "/api/v1"

    app.use("/", homeRoute)

    app.use("/users",userRoute);

    app.use("/menu",menuRoute);

    app.use("/cart",authenticateToken,cartRoute);

    app.use("/order",authenticateToken,authenticateTableBooking,orderRoute);

    app.use("/table", authenticateToken, tableRoute);
    
    app.use("/delivery",authenticateToken, deliveryRouter);
}
