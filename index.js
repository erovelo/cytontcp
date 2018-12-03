/***** CONFIGURACIONES TCP *****/
var port = 1337; // Puerto
var clients = []; // Lista de clientes

// importamos libreria net para crear servidor tcp
var net = require('net');

// Funcion que se llamara cada vez que se conecte un cliente
function OnNewClient(socket) {

    console.log('Nuevo cliente conectado');
    // Añado al cliente a la lista de clientes
    clients.push(socket);
}

// Funcion para enviar paquetes a los clientes
function broadcast(packet) {
    console.log('Enviando ' + packet);

    // Para cada uno de los clientes
    clients.forEach((client) =>{
        // Envio paquete al cliente
        client.write(packet);
    });
}

// Creamos servidor tcp
var server = net.createServer(OnNewClient);
/***** FIN CONFIGURACIONES TCP *****/


/***** CONFIGURACIONES CYTON *****/
const Cyton = require('openbci-cyton');
const ourboard = new Cyton({
    //verbose: true,
    simulate: true, // Datos sinteticos
});

// Este sirve para obtener todos los puertos, se puede imprimir en consola
ourboard.listPorts();

// Ejemplo de puerto al que esta conectado cyton en linux
//var portName = "/dev/ttyUSB0";

// Se conecta al dispositivo o simulador
ourboard.connect()
    // Si la conexion tuvo existo, ejecuta lo siguiente
    .then(() => {

        // Iniciamos servidor tcp
        server.listen(port);
        console.log('Escuchando por el puerto ' + port);

        // Empezamos a adquirir datos del dispositivo (o simulador)
        ourboard.streamStart();

        // lo configuramos para que en cada muestra llame a nuestra funcion OnGetSample
        ourboard.on('sample', OnGetSample);
    })
/***** FIN CONFIGURACIONES CYTON *****/


/**** ENVIO DE PAQUETES *****/

var idPacket = -1; // Numero de paquete

// Funcion que se mandará a llamar cada vez que se capturen datos de cyton
function OnGetSample(sample) { //sample es un array donde cada elemento es un array
    // Armamos paquete
    let packet = ""; // Paquete a enviar
    let date = new Date() //Devuelve la fecha de hoy

    // Adjuntamos número de paquete
    idPacket++;
    packet += idPacket + ";";

    // Adjuntamos fecha en la que se capturo en milisengundos
    // (milisegundos pasados desde 1970/01/01)
    let ms = date.getTime() + ";";

    // Por cada uno de los canales lo adjuntamos al paquete
    for (let i = 0; i < ourboard.numberOfChannels(); i++) {
        // (-0.000000000, 0.00000000 ) son Volts
        let channel = sample.channelData[i].toFixed(8);
        packet += channel + ";" ;
    }

    // Añado EOF
    packet += "VALID;"

    // Enviamos paquetes a clientes conectados
    broadcast(packet);
}