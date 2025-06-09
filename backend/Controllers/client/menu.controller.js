const searchHelper = require("../../helpers/searchHelper")
const Dish = require("../../models/dish.model")



const index = async (req, res) => {
    let find = {
        deleted : false,
    }
    // Search dishes
    if(req.query.keyword){
        find.name = searchHelper(req);
    }
    // Sort Dishes
    let sort = {
        STT : "desc"
    };

    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.like = "desc"
    }
    // Pagination
    let limit = 0; // Number of items in a page
    if(req.query.limit) {
        limit = parseInt(req.query.limit)
    } else {
        limit = 15
    }
    let skip = 0;  // Default skip is 0
    
    if (req.query.page) {
        let page = parseInt(req.query.page); // Current Page
        skip = (page - 1) * limit;
    }

    const dishes = await Dish
        .find(find)
        .sort(sort)
        .limit(limit)
        .skip(skip)
    res.status(200).json({
        message : "Success!",
        data : dishes
    })

}
const getCategory = async (req, res) => {
    let find = {
        deleted : false,
        slugCategory : req.params.slugCategory
    }
    // Search dishes
    if(req.query.keyword){
        find.name = searchHelper(req);
    }
    // Sort Dishes
    let sort = {
        STT : "desc"
    };
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.like = "desc"
    }
    // Pagination
    let limit = 0; // Number of items in a page
    if(req.query.limit) {
        limit = parseInt(req.query.limit)
    } else {
        limit = 15
    }
    let skip = 0;  // Default skip is 0
    
    if (req.query.page) {
        let page = parseInt(req.query.page); // Current Page
        skip = (page - 1) * limit;
    }
    
    const dishes = await Dish
        .find(find)
        .sort(sort)
        .limit(limit)
        .skip(skip)
    res.status(200).json({
        message : "Success!",
        data : dishes
    })
}
const getDish = async (req, res) => {
    let find = {
        deleted : false,
        slug : req.params.slug
    }


    const dish = await Dish.findOne(find)
    res.status(200).json({
        message : "Success!",
        dish : dish
    })
}
const getTopRatedDishes = async (req, res) => {
    try {
        const dishes = await Dish.find({ deleted: false })
            .sort({ rating: -1 })
            .limit(10);

        res.status(200).json({
            message: "Danh sách món ăn theo rating",
            data: dishes,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lấy danh sách món ăn thất bại",
            error: error.message,
        });
    }
};


module.exports = {
    index,
    getCategory,
    getDish,
    getTopRatedDishes,
}