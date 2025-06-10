const Order = require('../../models/order.model')
const User = require('../../models/user.model')

const index = async (req, res) => {
    try {
        const orders = await Order.find({ deleted: false })
            .sort({ createdAt: -1 }) // Sắp xếp theo thời gian mới nhất

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
        }));

        res.status(200).json({ orders: formattedOrders });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve order report",
            error: error.message,
        });
    }
};

const totalRevenue = async (req, res) => {
    try {
        // Doanh thu tháng hiện tại
        const currentMonth = new Date();
        const startOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

        // Doanh thu tháng trước
        const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        const endOfLastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);

        const currentRevenue = await Order.aggregate([
            { 
                $match: { 
                    status: "PAID",
                    createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth }
                }
            },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const lastRevenue = await Order.aggregate([
            { 
                $match: { 
                    status: "PAID",
                    createdAt: { $gte: lastMonth, $lte: endOfLastMonth }
                }
            },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const current = currentRevenue[0]?.total || 0;
        const last = lastRevenue[0]?.total || 0;
        
        // Tính phần trăm thay đổi
        let percentChange = 0;
        if (last > 0) {
            percentChange = ((current - last) / last) * 100;
        } else if (current > 0) {
            percentChange = 100;
        }

        res.status(200).json({ 
            totalRevenue: current,
            percentChange: percentChange.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to calculate revenue", error: error.message });
    }
}

const totalDishes = async (req, res) => {
    try {
        // Số món ăn tháng hiện tại
        const currentMonth = new Date();
        const startOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

        // Số món ăn tháng trước
        const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        const endOfLastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);

        const currentDishes = await Order.aggregate([
            { 
                $match: { 
                    createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth }
                }
            },
            { $unwind: "$items" },
            { $group: { _id: null, total: { $sum: "$items.quantity" } } }
        ]);

        const lastDishes = await Order.aggregate([
            { 
                $match: { 
                    createdAt: { $gte: lastMonth, $lte: endOfLastMonth }
                }
            },
            { $unwind: "$items" },
            { $group: { _id: null, total: { $sum: "$items.quantity" } } }
        ]);

        const current = currentDishes[0]?.total || 0;
        const last = lastDishes[0]?.total || 0;
        
        // Tính phần trăm thay đổi
        let percentChange = 0;
        if (last > 0) {
            percentChange = ((current - last) / last) * 100;
        } else if (current > 0) {
            percentChange = 100;
        }

        res.status(200).json({ 
            totalDishes: current,
            percentChange: percentChange.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to calculate total dishes", error: error.message });
    }
}

const totalOrders = async (req, res) => {
    try {
        // Số đơn hàng tháng hiện tại
        const currentMonth = new Date();
        const startOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

        // Số đơn hàng tháng trước
        const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        const endOfLastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);

        const currentOrders = await Order.countDocuments({
            createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth }
        });

        const lastOrders = await Order.countDocuments({
            createdAt: { $gte: lastMonth, $lte: endOfLastMonth }
        });

        // Tính phần trăm thay đổi
        let percentChange = 0;
        if (lastOrders > 0) {
            percentChange = ((currentOrders - lastOrders) / lastOrders) * 100;
        } else if (currentOrders > 0) {
            percentChange = 100;
        }

        res.status(200).json({ 
            totalOrders: currentOrders,
            percentChange: percentChange.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to calculate total orders", error: error.message });
    }
}

const changeStatus = async (req, res) => {
    try {
        const { orderCode } = req.params;

        const updatedOrder = await Order.findOneAndUpdate(
            { orderCode },
            { 
                status : "PAID" 
            },
            { new: true } 
        );
        if (!updatedOrder) {
            return res.status(404).json({
                message: `Không tìm thấy đơn hàng với mã ${orderCode}`,
            });
        }

        res.status(200).json({
            message: `Trạng thái đơn hàng ${orderCode} đã được cập nhật thành công.`,
            data: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: "Cập nhật trạng thái đơn hàng thất bại.",
            error: error.message,
        });
    }
};

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
    index,
    totalRevenue,
    totalDishes,
    totalOrders,
    changeStatus,
    getOrder,
}