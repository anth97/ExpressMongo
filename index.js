const express = require('express');
const cors = require('cors');

require('dotenv').config();
const path = require('path');

const { dbConnection } = require('./database/config.js');

const app = express();

app.use(cors());

app.use(express.json());

dbConnection();


//============================ API de autenticación y seguridad ===============
app.use('/api/user', require('./routes/core/security/user.route'));
app.use('/api/user', require('./routes/core/security/user.route'));
app.use('/api/login', require('./routes/auth/auth.route'));


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});