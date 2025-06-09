const Dish = require("../models/dish.model");




module.exports.showCartDetail = async (cart, cartDetail) => {
    // CartDetail để show cho 
    cartDetail.dishes = [];
    for (const item of cart.dishes) {
        const dish = await Dish.findOne({ _id: item.dish_id });
        if (!dish) {
            console.error(`Dish with id ${item.dish_id} not found`);
            continue; // Bỏ qua món ăn nếu không tìm thấy
        }
        const object = {
            id : dish.id,
            name : dish.name,
            price : dish.price,
            quantity : item.quantity,
            category : dish.category,
            imageUrl : dish.imageUrl,
        }
        cartDetail.dishes.push(object);
    }
}
