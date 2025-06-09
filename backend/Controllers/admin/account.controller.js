const { User, Admin, Staff, Delivery } = require("../../models/account.model");

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config();``

const getAllAccounts = async (req, res) => {
    try {
        const accounts = await User.find({
            deleted : false,
        })
        res.status(200).json({
            message: "Danh sách tài khoản",
            accounts: accounts
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching accounts!",
            error: error.message
        });
    }
};

const createAccount = async (req , res) => {
    const role = req.body.role;
    const existEmail = await User.findOne({
        email : req.body.email,
        deleted : false
    })
    if(existEmail) {
        return res.status(400).json({ message: 'Email đã được sử dụng.' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword

    let newAccount;
    try {
        switch (role) {
            case 'admin':
              newAccount = new Admin(req.body);
              break;
            case 'staff':
              newAccount = new Staff(req.body);
              break;
            case 'delivery':
              newAccount = new Delivery(req.body);
              break;
            default:
              throw new Error("Invalid role specified");
          }
        // Create JWT token
        const token = jwt.sign(
            { 
                id: newAccount.id,
                fullname: newAccount.fullname,
                role : newAccount.role
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );
        newAccount.token = token;
        await newAccount.save();

        // Set cookie
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,  
            secure: true     
        });
        res.status(201).json({
            message: "Tạo tài khoản thành công",
            account: newAccount,
            token: newAccount.token
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating account!",
            error: error.message
          });
    } 
    
}

const getRoleAccount = async (req, res) => {
    try {
        const accounts = await User.find({
            deleted: false,
            role : req.params.role
        }); // Lọc các tài khoản admin chưa bị xóa
        res.status(200).json({
            message: `Danh sách tài khoản ${req.params.role}`,
            accounts: accounts
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching admin accounts!",
            error: error.message
        });
    }
}


const login = async (req, res) => {
    const {email, password} = req.body;


    // Check email
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if(!user) {
        return res.status(400).json({ message: 'Email đăng nhập không chính xác.' });
    }
    // Check Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Sai mật khẩu.' });
    }
    // Create JWT token
    const token = jwt.sign(
        { 
            id: user.id,
            fullname: user.fullname,
            role : user.role,
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
    );
    // Lưu lại token vào moongoDB
    user.token = token;
    await user.save();
    
    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,  // ngăn JavaScript truy cập cookie này
        secure: true     // yêu cầu HTTPS
    });


    res.status(200).json({
        message : "Đăng nhập thành công!",
        user : user.fullname,
        role : user.role,
        token : user.token,
    })

}
const updateAccount = async (req, res) => {
    try {
        const id = req.user.id
        const updateIn4 = req.body

        const data = await User.updateOne({
            _id : id
        }, {
            $set : updateIn4
        })
        const updatedUser = await User.findOne({ _id: id }).select("-password");
        res.status(200).json({
            message : "Cập nhật thông tin thành công!",
            user : updatedUser
        })
    } catch (error) {
        res.status(500).json({
            message : "Error!",
            error : error.message
        })
    } 
}
const deleteAccount = async (req, res) => {
    try {
        const accountId = req.params.id; // Lấy ID từ URL
        const deletedAccount = await User.findByIdAndDelete(accountId);

        if (!deletedAccount) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại!' });
        }

        res.status(200).json({
            message: 'Tài khoản đã được xóa thành công!',
            account: deletedAccount,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Xóa tài khoản thất bại!',
            error: error.message,
        });
    }
};

module.exports = {
  getAllAccounts,
  createAccount,
  getRoleAccount,
  login,
  updateAccount,
  deleteAccount,
};
