const { Schema, model } = require("mongoose");
const { schemaBase } = require("../base");
//const { schemaAuditoria } = require("../auditoria");

const schema = {

    role: {
        type: String,        
        required: true,
        default: 'admin'
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    change_password: {
        type: Boolean,
        required: true,
        default: true
    },
    is_blocked: {
        type: Boolean,
        required: true,
        default: false
    },
};

const UserSchema = Schema(
    Object.assign(schema, schemaBase), { collection: 'user' }
);

UserSchema.method("toJSON", function() {
    const { __v, _id, clave, ...object } = this.toObject();

    object.id = _id;
    return object;
});

module.exports = model("User", UserSchema);