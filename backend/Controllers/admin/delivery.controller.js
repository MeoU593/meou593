const Order = require('../../models/order.model')
const User = require('../../models/user.model')

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 
            orderType: "Delivery",
            deleted: false
        }).sort({ createdAt: -1 });

        // Truy xuất thông tin khách hàng song song với Promise.all
        const customerPromises = orders.map(order => 
            User.findById(order.customer_id).select("fullname") // Chỉ lấy trường fullname
        );
        const customers = await Promise.all(customerPromises);

        // Định dạng lại dữ liệu đơn hàng
        const formattedOrders = orders.map((order, index) => ({
            orderCode: order.orderCode,
            customer: customers[index]?.fullname,
            menuItems: order.items.map(item => item.name).join(", "),
            totalPayment: `${order.totalAmount}`,
            status: order.status,
            deliveryDetails : order.deliveryDetails
        }));

        res.status(200).json({ formattedOrders });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve orders", error: error.message });
    }
}
const getOrder = async (req, res) => {
    try {
        const { orderCode } = req.params;
        const order = await Order.findOne({ orderCode, deleted: false });
        const customer = await User.findById(order.customer_id).select("fullname");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ order , customer });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve order", error: error.message });
    }
}

module.exports = {
    getOrders,
    getOrder,
}