const express = require('express')
const controller = require('../../Controllers/admin/account.controller')
const router = express.Router()
const authenticateToken = require('../../middlewares/authUser.middleware');
const authorizeRoles = require('../../middlewares/authRoles.middleware');

router.get('/',controller.getAllAccounts)

router.post('/create' ,controller.createAccount)

router.post('/login' ,controller.login)

router.get('/:role',controller.getRoleAccount)

router.patch('/edit' ,controller.updateAccount)

router.delete('/delete/:id' ,controller.deleteAccount)

// Thêm middleware vào các routes cần thiết
router.patch('/edit', authenticateToken, authorizeRoles(['admin']), controller.updateAccount);

router.delete('/delete/:id', authenticateToken, authorizeRoles(['admin']), controller.deleteAccount);

module.exports = router;