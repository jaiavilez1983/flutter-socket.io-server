const odbc = require('odbc')

const dbConnODBC = async() => {
    try {        
        await await odbc.connect(process.env.DB_ODBC);
        console.log('DB Online ODBC');
    } catch (error) {
        console.log(error);
        throw new Error("Error en la base de datos odbc - Hable con el admin");
    }
}

module.exports = {
    dbConnODBC
}