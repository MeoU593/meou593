//!1
const systemConfig = require("../../config/system")
const authenticateToken = require('../../middlewares/authUser.middleware')
const authorizeRoles = require('../../middlewares/authRoles.middleware')

const dashboard = require("./dashboard.route")
const dish = require("./dish.route")
const table = require("./table.route")
const tableBooking = require("./tableBooking.router")
const account = require("./account.route")
const delivery = require('./delivery.route')





module.exports = (app) => {
    const PATH = systemConfig.prefixAdmin  // prefix admin

    app.use(PATH + "/dashboard",authenticateToken,authorizeRoles(['admin','staff']), dashboard);
    app.use(PATH + "/dish",authenticateToken,authorizeRoles(['admin','staff']),  dish);
    app.use(PATH + "/table",authenticateToken,authorizeRoles(['admin','staff']),  table);
    app.use(PATH + "/tableBooking",authenticateToken,authorizeRoles(['admin','staff']),  tableBooking);
    app.use(PATH + "/accounts", account);
    app.use(PATH + "/delivery",authenticateToken, authorizeRoles(['admin','delivery']),  delivery);

}