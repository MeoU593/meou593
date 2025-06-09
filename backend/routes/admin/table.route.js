const express = require('express')
const controller = require('../../Controllers/admin/table.controller')
const router = express.Router()

router.post('/create', controller.createTable),
 
    
module.exports = router;