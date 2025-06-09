const express = require('express')
const controller = require('../../Controllers/admin/account.controller')
const router = express.Router()


router.get('/',controller.getAllAccounts)

router.post('/create' ,controller.createAccount)

router.post('/login' ,controller.login)

router.get('/:role',controller.getRoleAccount)

router.patch('/edit' ,controller.updateAccount)

router.delete('/delete/:id' ,controller.deleteAccount)

module.exports = router;