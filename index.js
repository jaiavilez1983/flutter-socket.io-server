const express = require('express');
const path = require('path');
require('dotenv').config();

//Db config
require('./database/config').dbConnection();

//Db config ODBC
//require('./database/configODBC').dbConnODBC();

//App de express
const app = express();

//Lectura y parseo del Body
app.use(express.json());

//Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/sockets');

//Path Publico
const publicPath = path.resolve( __dirname, 'public' );

app.use( express.static(publicPath) );


//Mis Rutas
app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/mensajes', require('./routes/mensajes'));


//
server.listen(process.env.PORT,(err) => {
    if(err) throw new Error(err);

    console.log('Servidor corriendo en puerto',process.env.PORT);

});