const PayOS = require("@payos/node");
require("dotenv").config();

const Order = require('../../models/order.model')
const TableBooking = require("../../models/tableBooking.model");
const User = require('../../models/user.model')
const generate = require('../../helpers/generateHelper');

const DEFAULT_CANCEL_URL = "http://localhost:3000/cancel.html";
const DEFAULT_RETURN_URL = "http://localhost:3000/success.html";


const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

const createPayment = async (req, res) => {
  try {
    const {amount, items} = req.body;
    const orderCode = parseInt(generate.generateOTP(10));
    if (!orderCode || !amount || !items || !items.length) {
      return res.status(400).json({ error: "Invalid input data" });
    }
    // Create Order
    let order = new Order({
      orderCode,
      customer_id : req.user._id,
      orderType : req.body.orderType,
      items,
      totalAmount : amount,
      status : "PENDING",
    });

    let paymentLinkRes = "";
      //! Nếu khách hàng chọn Delivery
    if (req.body.orderType === "Delivery") {
        if (!req.body.address || !req.body.deliveryTime) {
            return res.status(400).json({ message: "Address and delivery time are required for Delivery orders." });
        }
        const user = await User.findOne({
          _id : req.user._id
        })  
        let deliveryDetails = {
            address : req.body.address,
            deliveryTime : req.body.deliveryTime,
            phone : req.body.phone || user.phone
        }
      order.deliveryDetails = deliveryDetails
      //* Payment
      const body = {
        orderCode,
        amount,
        description: `Thanh toán ${orderCode}`,
        items,
        cancelUrl: 'http://localhost:3001/cancel-payment' ||  DEFAULT_CANCEL_URL,
        returnUrl:  'http://localhost:3001/success-payment' || DEFAULT_RETURN_URL,
      };
      paymentLinkRes = await payOS.createPaymentLink(body);
    } 

    //! Nếu khách hàng chọn ăn tại nhà hàng
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
      order.dineInDetails = table
      await TableBooking.updateOne({
          customer_id : req.user._id
      }, {
        deleted : true,
        orderCode : orderCode
      })
  }
  await order.save()
  // console.log(order)


    res.status(200).json({
      message: "Payment link created successfully",
      paymentLinkRes,
      order
    });
  } catch (error) {
    console.error("Error creating payment link:", error.message);
    res.status(500).json({ error: "Failed to create payment link" });
  }
};
const checkPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    console.log(paymentId)
    const paymentLink = await payOS.getPaymentLinkInformation(paymentId);
    res.status(200).json({
      message: "Payment status checked successfully",
      status : paymentLink.status,
      amount : paymentLink.amount,
      data : paymentLink
    });
  } catch (error) {
    console.error("Error checking payment status:", error.message);
    res.status(500).json({ error: "Failed to check payment status" });
  }
};
const updatePaymentSuccess = async (req, res) => {
  try {
    const  paymentId  = req.params.paymentId;
    console.log(paymentId)
    const paymentLink = await payOS.getPaymentLinkInformation(paymentId);
    if(paymentLink.status === "PAID") {
        //TODO : Update order status (cập nhật lại khi mà đã thanh toán thành công)
        const order = await Order.findOne({orderCode : paymentLink.orderCode})
        order.status = "PAID";
        await order.save()
        console.log("Đơn hàng đã thanh toán")
    }
    res.status(200).json({
      message: "Payment status checked successfully",
      status : paymentLink.status,
      amount : paymentLink.amount,
      data : paymentLink
    });
  } catch (error) {
    console.error("Error checking payment status:", error.message);
    res.status(500).json({ error: "Failed to check payment status" });
  }
}

const cancelledPayment = async (req, res) => {
  try {
    const  paymentId  = req.params.paymentId;
    console.log(paymentId)
    const cancelledPaymentLink = await payOS.cancelPaymentLink(1234, "Đơn thanh toán đã hết hạn");

    res.status(200).json({
      message: "Hủy đơn thành công",
      cancelledPaymentLink : cancelledPaymentLink
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ error: "Failed to check payment status" });
  }
}
module.exports = { 
    createPayment,
    checkPaymentStatus,
    updatePaymentSuccess,
    cancelledPayment, 
};


/**
 * const body = {
  orderCode: 1234,
  amount: 2000,
  description: "Thanh toan don hang",
  items: [
    {
      name: "Mi tom hao hao",
      quantity: 1,
      price: 2000,
    },
  ],
  cancelUrl: "http://localhost:3000/cancel.html",
  returnUrl: "http://localhost:3000/success.html",
};

const paymentLinkRes = await payOS.createPaymentLink(body);
export type paymentLinkRes = {
  bin: string, // Mã BIN ngân hàng
  accountNumber: string, // Số tài khoản của kênh thanh toán
  accountName: string, // Tên chủ tài khoản của kênh thanh toán
  amount: number, // Số tiền của đơn hàng
  description: string, // Mô tả đơn hàng, được sử dụng làm nội dung chuyển khoản
  orderCode: number, // Mã đơn hàng
  currency: string, // Đơn vị tiền tệ
  paymentLinkId: string, // ID link thanh toán
  status: string, // Trạng thái của link thanh toán
  checkoutUrl: string, // Đường dẫn trang thanh toán
  qrCode: string, // Mã QR thanh toán
};

export type paymentLink = {
  id: string, // ID link thanh toán
  orderCode: number, // Mã đơn hàng
  amount: number, // Số tiền của đơn hàng
  amountPaid: number, // Số tiền đã thanh toán
  amountRemaining: number, // Số tiền cần thanh toán còn lại
  status: string, // Trạng thái của link thanh toán
  createdAt: string, // Thời gian tạo link thanh toán
  transactions: TransactionType[], // Danh sách các giao dịch của link thanh toán
  cancellationReason: string | null, // Lý do hủy link thanh toán nếu liên kết đã bị hủy/
  canceledAt: string | null, // Thời gian hủy link thanh toán
};

 */