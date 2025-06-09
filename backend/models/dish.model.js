const mongoose = require('mongoose');

const slugify = require('slugify');


const DishSchema = new mongoose.Schema({
    STT : {
        type: Number,
    },
    name: {
        type: String,
        required: [true, 'Dish name is required'],
        trim: true
    },
    slug: { 
        type: String, 
        slug: "name",
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Dish price is required'],
        min: [0, 'Price must be a positive number']
    },
    slugCategory: { 
        type: String, 
        slug: "category",
    },
    category: {
        type: String,
        enum: ['Appetizer', 'Main Course', 'Dessert', 'Drink'],
        required: [true, 'Category is required']
    },
    imageUrl: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 3
    },

    deleted: {    // stock or not
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Middleware để tự động tạo slug trước khi lưu vào cơ sở dữ liệu
DishSchema.pre('save', function(next) {
    if (this.isModified('name') || this.isNew) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    if (this.isModified('category') || this.isNew) {
        this.slugCategory = slugify(this.category, { lower: true, strict: true });
    }
    next();
});


const Dish = mongoose.model('Dish', DishSchema , "dish");

module.exports = Dish;
