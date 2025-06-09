const Cart = require('../../models/cart.model')
const Dish = require('../../models/dish.model')
const Order = require('../../models/order.model')
const TableBooking = require("../../models/tableBooking.model");



const createOrder = async (req, res) => {
    try {
        const cart_id = req.cookies.cart_id
        if (!cart_id) return res.status(400).json({ message: "Cart ID not found in cookies." });

        const cart = await Cart.findOne({
            _id : cart_id,
        })
        if (!cart) return res.status(404).json({ message: "Cart not found." });
        
        let objectOrder = new Order();
        objectOrder.customer_id = req.user._id
        objectOrder.orderType = req.body.orderType
        objectOrder.cart_id = cart_id
        objectOrder.dishes = [];
        // Tính tổng số tiền
        let totalAmount = 0; 
        if(cart.dishes.length > 0) {
            for(const item of cart.dishes) {
                const dish = await Dish.findOne({
                    _id : item.dish_id
                })
                let objectDish = {
                    name : dish.name,
                    price : dish.price,
                    quantity : item.quantity,
                    imageUrl : dish.imageUrl
                }
                objectOrder.dishes.push(objectDish)
                totalAmount += (dish.price * item.quantity)
            }
        }
        objectOrder.totalAmount = totalAmount
        //!
        if(req.body.orderType === "Dine In") {
            const table = await TableBooking.find({
                customer_id : req.user._id
            })
            if(!table) {
                res.status(404).json({
                    message : "Table not found!"
                })
                return;
            }
            objectOrder.dineInDetails = table
            await TableBooking.findByIdAndDelete(req.user._id)
        }
        if (req.body.orderType === "Delivery") {
            if (!req.body.address || !req.body.deliveryTime) {
                return res.status(400).json({ message: "Address and delivery time are required for Delivery orders." });
            }
            let deliveryDetails = {
                address : req.body.address,
                deliveryTime : req.body.deliveryTime
            }
            objectOrder.deliveryDetails = deliveryDetails
        }
        //! QRPayment

        const order = new Order(objectOrder)
        await order.save()

        //! nếu đặt hàng thành công thì cập nhật lại cart
        await Cart.findByIdAndDelete(cart_id);


        res.status(200).json({
            message : "Success!",
            data : order
        })
    } catch (error) {
        res.status(501).json({
            message : "Error!",
            error : error.message
        })
    } 
}
const rateOrder = async (req, res) => {
    try {
        const { orderCode } = req.params; // Lấy mã đơn hàng từ URL
        const { rating } = req.body; // Lấy giá trị rating từ body request

        // Kiểm tra rating hợp lệ
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Đánh giá không hợp lệ. Rating phải từ 1 đến 5.",
            });
        }

        // Tìm và cập nhật đơn hàng
        const updatedOrder = await Order.findOneAndUpdate(
            { orderCode, status: 'PAID', deleted: false }, // Đảm bảo đơn hàng đã thanh toán và không bị xóa
            { rating }, // Cập nhật trường rating
            { new: true } // Trả về đơn hàng sau khi cập nhật
        );

        // Kiểm tra nếu không tìm thấy đơn hàng
        if (!updatedOrder) {
            return res.status(404).json({
                message: `Không tìm thấy đơn hàng đã thanh toán với mã ${orderCode}`,
            });
        }

        res.status(200).json({
            message: `Đơn hàng ${orderCode} đã được đánh giá thành công.`,
            data: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: "Đánh giá đơn hàng thất bại.",
            error: error.message,
        });
    }
};


module.exports = {
    createOrder,
    rateOrder,
}