const mongoose = require("mongoose");
const User = require("./user.model"); 

// Tạo discriminator cho các loại tài khoản khác nhau


const Admin = User.discriminator(
  "Admin",
  new mongoose.Schema({}, { discriminatorKey: 'role' })
);


const Staff = User.discriminator(
  "Staff",
  new mongoose.Schema({}, { discriminatorKey: 'role' })
);

// STATUS ĐỂ XÁC ĐỊNH TRẠNG THÁI NGƯỜI GIAO HÀNG
const Delivery = User.discriminator(
  "Delivery",
  new mongoose.Schema({
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    }
  }, { discriminatorKey: 'role', })
);

module.exports = { User, Admin, Staff, Delivery };
