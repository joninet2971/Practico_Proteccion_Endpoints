const express = require('express');
const router = express.Router();
const {
    getUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario,
    updateRol,
} = require('../controllers/users.controller');

const verifyToken = require('../middlewares/verifyToken')
const isAdmin = require('../middlewares/isAdmin')

router.get('/', verifyToken, isAdmin, getUsuarios);
router.get('/:id', verifyToken, getUsuarioById);
router.put('/:id', verifyToken, updateUsuario);
router.delete('/:id', verifyToken, isAdmin, deleteUsuario);
router.put('/rol/:id', verifyToken, isAdmin, updateRol);

module.exports = router;
