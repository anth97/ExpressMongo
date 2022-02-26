const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../../../models/auth/user.model");


const create = async (req, res = response) => {

    try {

        const modelo = new User(req.body);
        console.log(modelo);
        console.log(modelo.password);
        const salt = bcrypt.genSaltSync();
        modelo.password = bcrypt.hashSync(modelo.password, salt);
        await modelo.save();
        return res.json({
            ok: true,
            msg: "Usuario registrado correctamente.",
        });
    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg: error.msg,
        });
    }
};

const list = async (req, res = response) => {
    const modelo = await User.find({});
    console.log(modelo);
    res.json({
        ok: true,
        msg: "Listado de usuarios.",
        data: modelo,
    });
};

const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userModel = await User.findById(id, "company role person").populate(
            "person",
            "name last_name_p last_name_m dni is_male phone_number address email_address"
        );
        const { person } = userModel;

        const user = {
            company: userModel.company,
            role: userModel.role,
            name: person.name,
            last_name_p: person.last_name_p,
            last_name_m: person.last_name_m,
            dni: person.dni,
            is_male: person.is_male,
            phone_number: person.phone_number,
            address: person.address,
            email_address: person.email_address,
        };

        return res.json({
            ok: true,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error inesperado",
        });
    }
};

const updateUser = async (req, res) => {

    const session = await User.startSession();
    session.startTransaction();

    try {
        const opts = { session };
        const id = req.params.id;
        const user = await User.findById(id, "company role person")
        user.company = req.body.company;
        user.role = req.body.role;
        await user.save(opts);

        const person = await Person.findById(user.person)
        person.name = req.body.name;
        person.last_name_p = req.body.last_name_p;
        person.last_name_m = req.body.last_name_m;
        person.dni = req.body.dni;
        person.is_male = req.body.is_male;
        person.phone_number = req.body.phone_number;
        person.address = req.body.address;
        person.email_address = req.body.email_address;
        await person.save(opts);

        await session.commitTransaction();
        session.endSession();

        return res.json({
            ok: true,
            msg: 'Usuario actualizado'
        })

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            ok: false,
            msg: error.message,
        })
    }
};

const deleteUser = async (req, res) => { };

const userList = async (req, res = response) => {
    try {
        const users = await User.find({ es_borrado: false }, "username")
            .populate("person", "name last_name_p last_name_m")
            .populate("role", "role")
            .populate("company", "name");

        return res.json({
            ok: true,
            users,
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error inesperado",
        });
    }
};

const cambiarClaveAdministrador = async (req, res = response) => {
    try {
        const id = req.params.id;
        const usuario = await Usuario.findById(id);
        usuario.clave = req.body.clave;
        const now = dayjs();
        const salt = bcrypt.genSaltSync();
        usuario.clave = bcrypt.hashSync(usuario.clave, salt);
        usuario.comentario.push({
            tipo: "Editado",
            usuario: req.header("id_usuario_sesion"),
            usuario: req.header("usuario_sesion"),
            nombre: req.header("nombre_sesion"),
            fecha: now.format("DD/MM/YYYY hh:mm:ss a"),
            comentario: "Cambio de Clave",
        });
        await usuario.save();

        return res.json({
            ok: true,
            msg: "Clave cambiada correctamente",
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error inesperado",
        });
    }
};

const cambiarClaveUsuario = async (req, res = response) => {
    try {
        console.log(req.body);
        const { usuario, old_password, password } = req.body;
        const modelo = await Usuario.findOne({ usuario });

        const clave_valido = bcrypt.compareSync(old_password, modelo.clave);
        if (!clave_valido) {
            return res.status(400).json({
                ok: false,
                msg: "La clave anterior no es la correcta",
            });
        }

        modelo.clave = password;

        const salt = bcrypt.genSaltSync();
        modelo.clave = bcrypt.hashSync(modelo.clave, salt);

        await modelo.save();

        return res.json({
            ok: true,
            msg: "Clave cambiada correctamente",
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error inesperado",
        });
    }
};



module.exports = {
    create,
    list
};
