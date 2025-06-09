const express = require('express')
const controller = require('../../Controllers/client/menu.controller')
const router = express.Router()


router.get('/',controller.index)

router.get('/:slugCategory',controller.getCategory)

router.get('/detail/:slug',controller.getDish)

router.patch('/top-rated', controller.getTopRatedDishes);


module.exports = router;