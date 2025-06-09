const mongoose = require('mongoose');
const DeliveryBooking = require("../../models/deliveryBooking.model");
const {Delivery} = require("../../models/account.model")

// tẠO ĐƠN ĐẶT HÀNG
const createDeliveryOrder = async (req, res) => {
    try {
        const availableDelivery = await Delivery.findOne({
            status: 'available',
        });           
        if (!availableDelivery) {
            return res.status(400).json({
                message: "Đã hết nhân viên giao hàng.",
            });
        }
        const deliveryorder = new DeliveryBooking({
            customer_id: req.user._id,
            name: req.body.name,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            deliveryPersonId: availableDelivery._id,
        });
        await Delivery.findByIdAndUpdate(availableDelivery._id, { status: 'unavailable' });
        const data = await deliveryorder.save();
        const deliveryName = await DeliveryBooking.findById(data._id).populate('deliveryPersonId', 'fullname'); 
        res.status(201).json({
            message: `Đơn hàng đang được lấy bởi ${deliveryName.deliveryPersonId.fullname}`,
            data,
        });
    } catch (error) {
        res.status(500).json({
            message: "Đặt đơn hàng thất bại",
            error: error.message,
        });
    }
};

// XÁC NHẬN ĐƠN HÀNG ĐÃ HOÀN THÀNH
const confirmDeliverySuccess = async (req, res) => {
    try {
        const deliveryOrder = await DeliveryBooking.findById(req.body.id);
        if (!deliveryOrder) {
            return res.status(404).json({
                message: "Không tìm thấy đơn hàng.",
            });
        }
        if (deliveryOrder.status === 'Hoàn thành') {
            return res.status(400).json({
                message: "Đơn hàng đã được xác nhận là hoàn thành.",
            });
        }
        deliveryOrder.status = 'Hoàn thành';
        await deliveryOrder.save();
        await Delivery.findByIdAndUpdate(deliveryOrder.deliveryPersonId, { status: 'available'});
        res.status(200).json({
            message: "Đơn hàng đã hoàn thành.",
            data: deliveryOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: "Vận chuyển thất bại",
            error: error.message,
        });
    }
};


const getallBookings = async (req, res) => {
    try {
        const delivery = await DeliveryBooking.find();
        res.status(200).json(delivery);
    } catch (error) {
        res.status(500).json({
            message: "Lấy danh sách giao hàng thất bại",
            error: error.message,
        });
    }
};

module.exports = {
    createDeliveryOrder,
    confirmDeliverySuccess,
    getallBookings
};
