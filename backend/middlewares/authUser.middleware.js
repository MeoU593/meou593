const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const User = require("../models/user.model")


// Middleware xác thực JWT từ cookie
const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token; // Lấy token từ cookie

    if (!token) {
        return res.status(401).json({ message: 'Bạn cần đăng nhập để truy cập tài nguyên này.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id; // Lấy ID từ token đã giải mã

        // Tìm kiếm người dùng dựa trên ID từ token
        const user = await User.findOne({
            _id: userId,
            deleted: false
        });
        
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
}; 
module.exports = authenticateToken;
  

