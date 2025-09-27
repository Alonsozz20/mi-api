const{Usuario} = require('../models');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const { col } = require('sequelize');

const obtenerUsuarios = async(req, res) => {
    try {
         const usuario = await Usuario.findAll({
                attributes: {exclude:['password']},
                order :[['createdAt','DESC']]
        });
        res.json({
            success: true,
            message: 'Usuarios obtenidos correctamente',
            data: usuario,
            total: usuario.length
        })

    }catch(error){
        console.error('Error al Obtener usuarios', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message    
        })
    }
};

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, activo } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre, email y password son requeridos'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            activo: activo !== undefined ? activo : true
        });

        const { password: _omit, ...usuarioSinPassword } = nuevoUsuario.toJSON();

        return res.status(201).json({
            success: true,
            message: 'Usuario creado correctamente',
            data: usuarioSinPassword
        });

    } catch (error) {
        console.error('Error al crear usuario', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar un usuario
const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, password, activo } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        if (nombre !== undefined) usuario.nombre = nombre;
        if (email !== undefined) usuario.email = email;
        if (activo !== undefined) usuario.activo = activo;
        if (password !== undefined) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(password, salt);
        }

        await usuario.save();
        const { password: _omit, ...usuarioSinPassword } = usuario.toJSON();

        return res.json({
            success: true,
            message: 'Usuario actualizado correctamente',
            data: usuarioSinPassword
        });

    } catch (error) {
        console.error('Error al actualizar usuario', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar un usuario
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        await usuario.destroy();
        return res.json({
            success: true,
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar usuario', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports={
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};
