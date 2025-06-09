const Cart = require('../../models/cart.model')
const Dish = require('../../models/dish.model')

const showCartDetail = require('../../helpers/cartDetailHelper')

const index = async (req, res) => {
    try {
        const cart_id = req.cookies.cart_id;
        const cart = await Cart.findOne({
            _id : cart_id
        })
        if(!cart) return res.status(400).json({ message : "Không tìm thấy thông tin giỏ hàng!" })
        // CartDetail để show cho FrontEnd
        let cartDetail = {
            dishes : [],
        }
        await showCartDetail.showCartDetail(cart, cartDetail)
    
        res.status(200).json({
            message : "Success!",
            cart : cartDetail
        })
    } catch (error) {
        res.json({
            code : 400,
            message : "Error!",
            error : error.message
        })
    } 
}
const addToCart = async (req, res) => {
    try {
        const cart_id = req.cookies.cart_id;
        const dishId = req.body.dishId;
        const quantity = parseInt(req.body.quantity);


        // Kiểm tra xem có sản phẩm đó chưa
        const cart = await Cart.findOne({
            _id : cart_id
        })
        const existDish = cart.dishes.find(item => item.dish_id == dishId)
        // Nếu tồn tại => tăng quantity lên
        if(existDish){
            existDish.quantity += quantity ;
            await Cart.updateOne(
                {
                    _id : cart_id,
                    'dishes.dish_id' : dishId,
                },
                {
                    'dishes.$.quantity': existDish.quantity
                }
            )
        }
        // Nếu không thì tạo một object dish mới
        else {
            const objectDish = {
                dish_id : dishId,
                quantity : quantity
            }
            // Lưu vào database
            await Cart.updateOne(
                {_id : cart_id}, 
                {
                    $push : {dishes : objectDish}
                }
            )
        }
        // CartDetail để show cho FrontEnd
        const cartDetail = {
            dishes : [],
        }
        const newCart = await Cart.findOne({_id : cart_id})
        await showCartDetail.showCartDetail(newCart, cartDetail)


        res.status(200).json({
            message : "Thêm sản phẩm vào giỏ hàng thành công!",
            cart : cartDetail
        })
    } catch (error) {
        res.status(400).json({
            message : "Error!",
            error : error.message
        })
    } 
}

const updateCart = async (req, res) => {
    try {
        const cart_id = req.cookies.cart_id;
        const dish_id = req.params.dish_id;
        const quantity = parseInt(req.body.quantity);

        await Cart.updateOne(
            {
                _id : cart_id,
                'dishes.dish_id' : dish_id,
            },
            {
                'dishes.$.quantity': quantity
            }
        )
        const dish = await Dish.findOne({ _id: dish_id });


        res.status(200).json({
            message : `Cập nhật số lượng cho ${dish.name} thành công! `,
        })
    } catch (error) {
        res.status(400).json({
            message : "Error!",
            error : error.message
        })
    } 
}
const deleteDish = async (req, res) => {
    try {
        const cart_id = req.cookies.cart_id;
        const dish_id = req.params.dish_id;
        await Cart.updateOne(
            {
                _id : cart_id,
                'dishes.dish_id' : dish_id,
            },
            {
                $pull : {dishes : {dish_id : dish_id}}
            }
        )
        res.status(200).json({
            message : "Xóa món ăn thành công!",
        })
    } catch (error) {
        res.status(500).json({
            message : "Error!",
            error : error.message
        })
    }   
}

module.exports = {
    index,
    addToCart,
    updateCart,
    deleteDish,
}