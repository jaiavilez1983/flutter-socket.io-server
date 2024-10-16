const { response } = require('express');
const bcrypt  = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

// Crear nuevo usuario
const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;
    try {

        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta resgitrado'
            });
        }

        const usuario = new Usuario( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt );

        await usuario.save();

        //Generar mi JWT
        const token = await generarJWT( usuario.id );
    
        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
}

//hacer login
const login = async(req, res = response ) => {
    const { email, password} = req.body;
    try {
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        //Validar el password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }
        //Validar el JWT
        const token = await generarJWT(usuarioDB.id);
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const renewToken = async (req, res = response) => {
    //const uid
    const uid = req.uid;

    //generar un nuevo JWT 
    const token = await generarJWT(uid);

    //obtener el usuario
    const usuario = await Usuario.findById(uid);


    res.json({
        ok: true,
        usuario,
        token
    });

}

module.exports = {
    crearUsuario,
    login,
    renewToken
}