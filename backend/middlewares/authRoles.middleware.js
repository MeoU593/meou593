// DÙNG ĐỂ XÁC ĐỊNH ROLE CỦA NGƯỜI DÙNG ĐỂ TRUY CẬP VÀO NHỮNG NƠI CẦN CẤP PHÉP

const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Bạn không có quyền truy cập tài nguyên này.',
            });
        }
        next();
    };
};

module.exports = authorizeRoles;