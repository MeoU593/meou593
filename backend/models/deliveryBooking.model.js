const mongoose = require('mongoose');

//MODEL CỦA VIỆC ĐẶT GIAO HÀNG

const DeliveryBookingSchema = new mongoose.Schema({
    customer_id: String,
    name: String,
    phoneNumber:
    {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\d{10,15}$/, 'Phone number must contain only digits and be between 10 to 15 characters long']
    },
    address:
    {
        type: String,
        required: [true, 'address is required'],
    },    
    status:
    {
        type: String,
        enum: ['Đang được giao', 'Hoàn thành'],
        default: 'Đang được giao'
    },
    deliveryPersonId: {    // DÙNG ĐỂ TRUY CẬP VÀO TÊN NGƯỜI GIAO HÀNG
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery" 
    },
}, {
    timestamps: true
});

const DeliveryBooking = mongoose.model('DeliveryBooking', DeliveryBookingSchema, "deliveryBooking");

module.exports = DeliveryBooking;

