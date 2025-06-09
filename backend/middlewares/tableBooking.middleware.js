const tableBooking = require("../models/tableBooking.model")




// Middleware xác thực khách hàng đã đặt bàn ăn
const authenticateTableBooking = async (req, res, next) => {
    try {
        if(req.body.orderType == "Dine In") {
            const userId = req.user._id;
            const availableTableBooking = await tableBooking.findOne({
                customer_id : userId
            })
            // Nếu chưa đặt bàn
            if(!availableTableBooking) {
                return res.status(404).json({ message: 'Bạn chưa đặt bàn' });
            }
            next();
        }
        else {
            next();
        }
    } catch (error) {
        res.json({
            message : "Error!",
            error : error.message
        })
    } 
};

module.exports = authenticateTableBooking;


