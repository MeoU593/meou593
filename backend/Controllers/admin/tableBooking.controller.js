const mongoose = require('mongoose');
const TableBooking = require("../../models/tableBooking.model");
const Order = require('../../models/order.model');
const User = require('../../models/user.model');

const getallBookings = async (req, res) => {
    try {
        const { date } = req.query; // Lấy ngày từ query params (dạng dd/mm/yyyy)

        let filter = {};
        if (date) {
            filter.bookingDate = date;
        }

        // Tìm kiếm danh sách đặt bàn với bộ lọc
        const bookings = await TableBooking.find(filter)

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({
            message: "Lấy danh sách đặt bàn thất bại",
            error: error.message,
        });
    }
};

const getBooking = async (req, res) => {
    try {
        const booking = await TableBooking.findOne({ _id: req.params.id })
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }


        // Tìm thông tin đơn hàng liên quan đến lần đặt bàn
        const order = await Order.findOne({ orderCode: booking.orderCode });
        // Thông tin khách hàng
        const user = await User.findOne({
            _id: booking.customer_id
        })

        // Chuẩn bị dữ liệu phản hồi
        const detailedBooking = {
            bookingId: booking._id,
            customer: user.fullname,
            phone: user.phone,
            bookingDate: booking.bookingDate,
            bookingTime: booking.bookingTime,
            items : order?.items,
        };

        res.status(200).json(detailedBooking);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve booking details',
            error: error.message,
        });
    }
};



module.exports = {
    getallBookings,
    getBooking,
};
