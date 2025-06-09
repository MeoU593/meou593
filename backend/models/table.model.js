const mongoose = require("mongoose");
const moment = require('moment');


const TableSchema = new mongoose.Schema({
    numberofSeats: {
        type: String,
        enum: [2, 4, 6, 8, 10],
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    },


    // ĐOẠN NÀY ĐỂ KHI ĐI VÀO CONTROLLER THÌ DÙNG ĐỂ KIỂM TRA TRONG KHOẢNG THỜI GIAN ĐÓ THÌ NÓ CÓ CẤN LỊCH KO (NÊN ĐỔI TÊN CHỨ KO NÊN DÙNG HISTORY)
    bookingHistory: [{ 
        startBooking: {
            type: Date,
            required: true,
            set: (date) => moment(date, 'DD/MM/YYYY HH:mm:ss').toDate()
        },
        endBooking: {
            type: Date,
            required: true,
            set: (date) => moment(date, 'DD/MM/YYYY HH:mm:ss').toDate()
        },
    }]

},
{
    timestamps: true
}
)

const Table = mongoose.model("Table", TableSchema, "table");

module.exports = Table;
