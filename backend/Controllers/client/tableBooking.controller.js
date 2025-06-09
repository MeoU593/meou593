const mongoose = require('mongoose');
const TableBooking = require("../../models/tableBooking.model");
const Table = require('../../models/table.model');
const moment = require('moment');
// *****LOGIC Ở ĐÂY VẪN CÓ VÀI CHỖ CHƯA HỢP LÍ Ở NGAY PHẦN ĐẦU ĐOẠN XÁC ĐỊNH BÀN ĐỂ ĐẶT, NẾU ĐỂ LÀ TÌM BÀN AVAILABLE THÌ VÔ LÍ (DÒNG 12) NÓ SẼ BỊ MISS TRƯỜNG HỢP (SỬA SAU)
const createBooking = async (req, res) => {
    try {
        console.log("Bắt đầu");

        // TÌM TẤT CẢ CÁC BÀN PHÙ HỢP VỚI YÊU CẦU 
        const availableTables = await Table.find({
            status: 'available',
            numberofSeats: req.body.numberofSeats
        });

        if (availableTables.length === 0) {
            return res.status(400).json({
                message: "Không còn bàn nào có sẵn để đặt!",
            });
        }

        // THỜI GIAN ĐẶT BÀN VÀ THỜI GIAN BÀN HẾT HIỆU LỰC
        const bookingDateTime = moment.utc(`${req.body.bookingDate} ${req.body.bookingTime}`, 'DD/MM/YYYY HH:mm:ss');
        const expiryDateTime = bookingDateTime.clone().add(2, 'hours'); 

        let isAvailable = false;
        let selectedTable = null;

        // THỜI GIAN ĐẶT BÀN PHẢI TRƯỚC X PHÚT (Ở ĐÂY ĐANG LẤY LÀ 5)
        const now = moment.utc();
        const oneHourInMillis = 60 * 1000;  // 1 * 1000 = 1 GIÂY
        if (bookingDateTime.diff(now) < oneHourInMillis) {
            return res.status(400).json({
                message: "Thời gian đặt bàn phải trước ít nhất 5 phút.",
            });
        }

        // DUYỆT QUA TẤT CẢ CÁC BÀN VÀ KIẾM BÀN CÓ THỂ ĐẶT
        for (let availableTable of availableTables) {
            let isTableAvailable = true;
      

            // KIỂM TRA XEM THỬ BÀN NÀY CÓ ĐC ĐẶT CHỖ CHƯA, NẾU CÓ THÌ XEM THỬ CHỖ ĐẶT CỦA NÓ CÓ TRÙNG VỨI CHỖ KHÁC VỪA ĐẶT KHÔNG
            if (availableTable.bookingHistory.length > 0) {
                for (let booking of availableTable.bookingHistory) {
                    const startBooking = moment.utc(booking.startBooking);
                    const endBooking = moment.utc(booking.endBooking);

                    if (
                        (bookingDateTime.isBetween(startBooking, endBooking, null, '[)')) || 
                        (expiryDateTime.isBetween(startBooking, endBooking, null, '(]')) || 
                        (bookingDateTime.isSameOrBefore(startBooking) && expiryDateTime.isSameOrAfter(endBooking))
                    ) {
                        isTableAvailable = false;
                        break;
                    }
                }
            }

            // NẾU BÀN CÒN TRỐNG THÌ CHỌN BÀN NÀY
            if (isTableAvailable) {
                selectedTable = availableTable;
                isAvailable = true;
                break;
            }
        }

    
        if (!isAvailable) {
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

        // TÍNH KHOẢNG THỜI GIAN TỪ BÂY GIỜ ĐẾN KHI ĐẶT BÀN, ĐỂ ĐẾN KHI ĐÓ NÓ MỚI ĐỔI THÀNH UNAVAILABLE
        const delayUntilBooking = bookingDateTime.utc().valueOf() - now.utc().valueOf();

        
        setTimeout(async () => {
            await Table.findByIdAndUpdate(selectedTable._id, { status: 'unavailable' });
            // SAU KHI HẾT 2 GIỜ THÌ BÀN SẼ TỰ CHUYỂN VỀ AVAILABLE
            setTimeout(async () => {
                await Table.findByIdAndUpdate(selectedTable._id, { status: 'available' });
            }, 60 * 1000); 
        }, delayUntilBooking);

        const booking = new TableBooking({
            customer_id: req.user._id,
            bookingDate: req.body.bookingDate,
            bookingTime: req.body.bookingTime,
            numberofSeats: req.body.numberofSeats,
            tableId: selectedTable._id 
        });

        const data = await booking.save();

        res.status(201).json({
            message: `Chúc mừng ${req.user.fullname} đã đặt bàn thành công`,
            data,
        });
    } catch (error) {
        res.status(500).json({
            message: "Đặt bàn thất bại",
            error: error.message,
        });
    }
};


module.exports = {
    createBooking,
};


