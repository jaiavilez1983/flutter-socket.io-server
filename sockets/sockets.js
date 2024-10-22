const {io} = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');


const Band = require('../models/band');
const Bands = require('../models/bands');
const bands = new Bands();
bands.addBand(new Band( 'Queen') );
bands.addBand(new Band( 'Bon Jovi' ) );
bands.addBand(new Band( 'Heroes del Silencio' ) );
bands.addBand(new Band( 'Metallica' ) );


//Mensajes de sockets
io.on('connection', (client) => {   
    console.log('Cliente conectado');
    
    //Ver Clientes conectados
    //console.log(client.handshake.headers['x-token']);

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
    //console.log(valido, uid);
    if(!valido) { return client.disconnect();}
    console.log('Cliente autenticado');
    
    //Cliente autenticado
    usuarioConectado(uid);

    //Ingresar al usuario a una sala en particular
    client.join(uid); //Creo una sala

    //Escuchar al clientes
    client.on('mensaje-personal' , async (payload) => {
        //console.log(payload);
        await grabarMensaje(payload);

        io.to(payload.para).emit('mensaje-personal',payload);
    });


    

    client.on('disconnect', () => { 
        //console.log('Cliente desconectado');
        usuarioDesconectado(uid);
     });

     
    /*     
    client.emit('active-bands', bands.getBands() );

    client.on('mensaje', ( payload ) => { 
        console.log('Mensaje!!!', payload);
        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });

    client.on('vote-band', (payload) => {
        //console.log(payload);
        bands.voteBand( payload.id );
        io.emit('active-bands', bands.getBands() )
    });

    client.on('add-band', (payload) => {
        //console.log(payload);
        const newBand = new Band(payload.name); 
        bands.addBand( newBand );
        io.emit('active-bands', bands.getBands() )
    });

    client.on('delete-band', (payload) => {
        //console.log(payload);        
        bands.deleteBand( payload.id );
        io.emit('active-bands', bands.getBands() )
    });   */ 


});