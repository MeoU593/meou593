const mongoose = require('mongoose');
const TableBooking = require("../../models/tableBooking.model");
const Table = require('../../models/table.model');
const moment = require('moment');

const createBooking = async (req, res) => {
    try {
        console.log("Bắt đầu đặt bàn");
        console.log("Request body:", req.body);

        // Kiểm tra xem có bàn nào trong hệ thống không
        const allTables = await Table.find({});
        console.log("Tất cả bàn trong hệ thống:", allTables.length);

        if (allTables.length === 0) {
            return res.status(400).json({
                message: "Hệ thống chưa có bàn nào. Vui lòng liên hệ quản lý!",
            });
        }

        // TÌM TẤT CẢ CÁC BÀN PHÙ HỢP VỚI YÊU CẦU 
        const availableTables = await Table.find({
            numberofSeats: { $gte: parseInt(req.body.numberofSeats) } // Tìm bàn có số ghế >= yêu cầu
        });

        console.log("Bàn phù hợp với số ghế:", availableTables.length);

        if (availableTables.length === 0) {
            return res.status(400).json({
                message: `Không có bàn nào phù hợp với ${req.body.numberofSeats} người!`,
            });
        }

        // THỜI GIAN ĐẶT BÀN VÀ THỜI GIAN BÀN HẾT HIỆU LỰC
        const bookingDateTime = moment(`${req.body.bookingDate} ${req.body.bookingTime}`, 'DD/MM/YYYY HH:mm');
        const expiryDateTime = bookingDateTime.clone().add(2, 'hours'); 

        console.log("Thời gian đặt bàn:", bookingDateTime.format());
        console.log("Thời gian hết hạn:", expiryDateTime.format());

        // KIỂM TRA THỜI GIAN ĐẶT BÀN (phải trước ít nhất 5 phút)
        const now = moment();
        const fiveMinutesInMillis = 5 * 60 * 1000; // 5 phút
        
        if (bookingDateTime.diff(now) < fiveMinutesInMillis) {
            return res.status(400).json({
                message: "Thời gian đặt bàn phải trước ít nhất 5 phút so với hiện tại.",
            });
        }

        let selectedTable = null;

        // DUYỆT QUA TẤT CẢ CÁC BÀN VÀ KIỂM TRA TÍNH KHẢ DỤNG
        for (let table of availableTables) {
            let isTableAvailable = true;
            console.log(`Kiểm tra bàn ${table._id}...`);

            // KIỂM TRA LỊCH SỬ ĐẶT BÀN
            if (table.bookingHistory && table.bookingHistory.length > 0) {
                for (let booking of table.bookingHistory) {
                    const startBooking = moment(booking.startBooking);
                    const endBooking = moment(booking.endBooking);

                    console.log(`Booking hiện tại: ${startBooking.format()} - ${endBooking.format()}`);

                    // Kiểm tra xem có trùng lặp thời gian không
                    if (
                        (bookingDateTime.isBetween(startBooking, endBooking, null, '[)')) || 
                        (expiryDateTime.isBetween(startBooking, endBooking, null, '(]')) || 
                        (bookingDateTime.isSameOrBefore(startBooking) && expiryDateTime.isSameOrAfter(endBooking))
                    ) {
                        console.log("Bàn bị trùng lịch");
                        isTableAvailable = false;
                        break;
                    }
                }
            }

            // Kiểm tra xem đã có người đặt bàn này trong thời gian tương lai chưa
            const existingBooking = await TableBooking.findOne({
                tableId: table._id,
                bookingDate: req.body.bookingDate,
                deleted: false
            });

            if (existingBooking) {
                const existingBookingTime = moment(`${existingBooking.bookingDate} ${existingBooking.bookingTime}`, 'DD/MM/YYYY HH:mm');
                const existingExpiryTime = moment(`${existingBooking.expiryDate} ${existingBooking.expiryTime}`, 'DD/MM/YYYY HH:mm');

                if (
                    (bookingDateTime.isBetween(existingBookingTime, existingExpiryTime, null, '[)')) || 
                    (expiryDateTime.isBetween(existingBookingTime, existingExpiryTime, null, '(]')) || 
                    (bookingDateTime.isSameOrBefore(existingBookingTime) && expiryDateTime.isSameOrAfter(existingExpiryTime))
                ) {
                    console.log("Bàn đã được đặt trong TableBooking");
                    isTableAvailable = false;
                }
            }

            // NẾU BÀN CÒN TRỐNG THÌ CHỌN BÀN NÀY
            if (isTableAvailable) {
                selectedTable = table;
                console.log(`Đã chọn bàn ${table._id}`);
                break;
            }
        }

        if (!selectedTable) {
            return res.status(400).json({
                message: "Không còn bàn nào có sẵn để đặt trong khoảng thời gian này!",
            });
        }

        // CẬP NHẬT PHẦN HISTORY CỦA TABLE
        selectedTable.bookingHistory.push({
            startBooking: bookingDateTime.toDate(),
            endBooking: expiryDateTime.toDate()
        });

        await selectedTable.save();
        console.log("Đã cập nhật lịch sử bàn");

        // TẠO BOOKING MỚI
        const booking = new TableBooking({
            customer_id: req.user._id,
            bookingDate: req.body.bookingDate,
            bookingTime: req.body.bookingTime,
            numberofSeats: req.body.numberofSeats,
            tableId: selectedTable._id 
        });

        const data = await booking.save();
        console.log("Đã tạo booking thành công");

        // LƯỚI THỜI GIAN ĐỂ CẬP NHẬT TRẠNG THÁI BÀN (tùy chọn - có thể bỏ nếu không cần)
        const delayUntilBooking = Math.max(0, bookingDateTime.valueOf() - now.valueOf());
        
        if (delayUntilBooking > 0) {
            setTimeout(async () => {
                try {
                    await Table.findByIdAndUpdate(selectedTable._id, { status: 'unavailable' });
                    console.log(`Bàn ${selectedTable._id} đã chuyển thành unavailable`);
                    
                    // SAU 2 GIỜ THÌ CHUYỂN VỀ AVAILABLE
                    setTimeout(async () => {
                        try {
                            await Table.findByIdAndUpdate(selectedTable._id, { status: 'available' });
                            console.log(`Bàn ${selectedTable._id} đã chuyển về available`);
                        } catch (error) {
                            console.error("Lỗi khi cập nhật trạng thái bàn về available:", error);
                        }
                    }, 2 * 60 * 60 * 1000); // 2 giờ
                } catch (error) {
                    console.error("Lỗi khi cập nhật trạng thái bàn:", error);
                }
            }, delayUntilBooking);
        }

        res.status(201).json({
            message: `Chúc mừng ${req.user.fullname} đã đặt bàn thành công!`,
            data: {
                ...data.toObject(),
                tableNumber: selectedTable._id,
                tableSeats: selectedTable.numberofSeats
            },
        });
    } catch (error) {
        console.error("Lỗi đặt bàn:", error);
        res.status(500).json({
            message: "Đặt bàn thất bại",
            error: error.message,
        });
    }
};

module.exports = {
    createBooking,
};