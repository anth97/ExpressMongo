const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../../helpers/jwt");
const User = require("../../models/auth/user.model");

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const modelo = await User.findOne({ username });
        if (!modelo) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario y/o clave incorrectos.",
            });
        }

        const validPassword = bcrypt.compareSync(password, modelo.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario y/o clave incorrectos.",
            });
        }

        const token = await generarJWT(modelo.id);

        return res.json({
            ok: true,
            msg: "Usuario autenticado correctamente.",
            token
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Token no es correcto.",
        });
    }
}


const refresh_token = async (req, res) => {
    const id = req.id;
    const token = await generarJWT(id);
    const user = await User.findById({ _id: id });

    return res.json({
        ok: true,
        msg: "Token actualizado correctamente.",
        token,
        user
    });
}

module.exports = {
    login,
    refresh_token
};