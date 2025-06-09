const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    customer_id: String,
    dishes: [
        {
            dish_id : String,
            quantity : Number,
        }
    ],
    totalAmount: Number,
    deleted: {  // dùng để xem lịch sử của khách hàng => Hóa đơn đã thanh toán delected = true
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true
    }
);

const Cart = mongoose.model('Cart', CartSchema, "cart");

module.exports = Cart;
