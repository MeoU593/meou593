const Dish = require("../../models/dish.model");

const index = (req , res) => {
    res.send("Dish") 
}
// Hien cac mon an
const getDishes = async (req, res) => {
    try {
        const dishes = await Dish.find({
            deleted : false
        })
        .sort({
            STT : "desc",
            rating : "desc"
        })
        res.json({
            code : 200,
            message : "Success!",
            data : dishes
        })
    } catch (error) {
        res.json({
            code : 400,
            message : "Error!",
            error : error.message
        })
    } 
}

const getDish = async (req, res) => {
    try {
        const slugDish = req.params.slugDish; 
        const dish = await Dish.findOne({
            slug: slugDish,
            deleted : false
        }).select("name description like price imageUrl category")

        res.status(200).json({
            message : "Success!",
            data : dish
        })
    } catch (error) {
        res.status(400).json({
            message: "Error!",
            error: error.message
        })
    }
}

// addDish
const createDish = async (req, res) => {
    try {
        const existDish = await Dish.findOne({
            name : req.body.name,
            deleted : false
        })
        if(existDish) {
            res.status(400).json({
                message : "Món ăn đã tồn tại",
            })
        } else {
            const STT = await Dish.countDocuments() + 1;
            const dish = new Dish({
                STT : STT,
                name : req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category,
                imageUrl: req.body.imageUrl,
                rating : req.body.rating
            });
            const data = await dish.save();
            const name = data.name
            // console.log(dish)

            res.status(201).json({
                message : `Sản phẩm ${name} được thêm thành công`,
                data : data,
            })
        }
    } catch (error) {
        res.status(500).json({
            message : "Thêm món ăn thất bại!",
            error : error.message
        })
    } 
}

const updateDish = async (req, res) => {
    try {
        const slugDish = req.params.slugDish;
        const updateInf = req.body;

        // console.log(slugDish)

        const existingDish = await Dish.findOne({
            slug: slugDish,
            deleted: false,
        });

        if (!existingDish) {
            return res.status(404).json({
                message: "Món ăn không tồn tại!",
            });
        }

        const updatedDish = await Dish.findOneAndUpdate(
            { slug : slugDish },
            { $set: updateInf },
            { new: true, fields: '-name' }
        );

        res.status(200).json({
            message: "Cập nhật món ăn thành công!",
            dish: updatedDish,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error!",
            error: error.message,
        });
    }
};

const deleteDish = async (req, res) => {
    try {
        const slugDish = req.params.slugDish;
        const deletedDish = await Dish.findOneAndUpdate(
            { slug: slugDish },
            { $set: { deleted: true } },
            { new: true }
        );
        res.status(200).json({
            message: "Xóa món ăn thành công!",
            dish: deletedDish,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error!",
            error: error.message,
        });
    }
};



module.exports = {
    index,
    getDishes,
    createDish,
    getDish,
    updateDish,
    deleteDish,
}