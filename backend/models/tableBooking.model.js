const mongoose = require('mongoose');
const moment = require('moment');
const Table = require('./table.model');

const TableBookingSchema = new mongoose.Schema({
    customer_id: String,
    orderCode: Number,
    bookingDate: {  
        type: String,
        required: [true,'DD/MM/YYYY'] 
    },
    bookingTime: {  // mấy giờ
        type: String,
        required: [true, 'HH:mm:ss'] 
    },
    numberofSeats: {
        type: String,
        enum: [2, 4, 6, 8, 10],
        required: true,
    },
    tableId: {
        type: String,
    },
    deleted: {
        type: Boolean,
        default: false
    },
    // NGÀY VÀ GIỜ BÀN ĂN HẾT HẠN 
    expiryDate: {  
        type: String,
    },
    expiryTime: {  
        type: String,
    },
}, {
    timestamps: true
});

TableBookingSchema.pre('save', function(next) {
    const bookingDateTime = moment(`${this.bookingDate} ${this.bookingTime}`, 'DD/MM/YYYY HH:mm:ss');  //DÙNG MOMENT ĐỂ KẾT HỢP NGÀY VÀ GIỜ
    // THÊM HAI TIẾNG VÀO THỜI GIAN ĐẶT
    const expiryDateTime = bookingDateTime.add(2, 'hours');  
    this.expiryDate = expiryDateTime.format('DD/MM/YYYY');  
    this.expiryTime = expiryDateTime.format('HH:mm:ss');  

    next();  
});

const TableBooking = mongoose.model('TableBooking', TableBookingSchema, "tableBooking");

module.exports = TableBooking;

