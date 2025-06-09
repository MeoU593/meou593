const express = require('express')
const controller = require('../../Controllers/admin/dish.controller')
const router = express.Router()

// Upload images to cloudinary
const fileUploader = require('../../config/cloudinary.config');


// router.patch('/change-status/:status/:id',controller.changeStatus)


router.get('/detail/:slugDish', controller.getDish),
    
router.get('/list', controller.getDishes),
    
router.patch(
    '/edit/:slugDish',
    fileUploader.single('file'),
    async (req, res, next) => {
        if (req.file) {
            req.body.imageUrl = req.file.path;
        }
        next();
    },
    controller.updateDish),
    
router.post(
    '/create',
    fileUploader.single('file'), // Sử dụng uploadCloud thay vì fileUploader
    async (req, res, next) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded!' });
        }

        req.body.imageUrl = req.file.path; // Đường dẫn file được lưu trữ trên Cloudinary
        next();
    }, 
    controller.createDish
);

router.delete('/delete/:slugDish', controller.deleteDish)

module.exports = router;