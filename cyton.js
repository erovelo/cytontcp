// Configuraciones de Cyton
const Cyton = require('openbci-cyton');
const ourboard = new Cyton({
    //verbose: true,
    simulate: true, // Datos sinteticos
});

// Este sirve para obtener todos los puer
ourboard.listPorts();
var portName = "/dev/ttyUSB0";

// Se conecta al dispositivo o simulador
ourboard.connect()
    // Si la conexion tuvo existo, ejecuta lo siguiente
    .then(() => {

        // Empezamos a adquirir datos del dispositivo (o simulador)
        //ourboard.streamStart();

        // Lo siguiente se mandará a llamar cada vez que se obtiene datos
        ourboard.on('sample', sample => {
            // Obtenemos la fecha de la muestra
            let date = new Date();

            //Return the number of milliseconds since 1970/01/01
            let ms = date.getTime();

            // Formamos una cadena para almecenar todos los datos
            let cad = "";

            // La cadena sera formada por la fecha, seguido de los canales, separados por punto y coma
            cad += ms + ";";

            // Agregamos todos los canales a la cadena
            for (let i = 0; i < ourboard.numberOfChannels(); i++) {
                //console.log("Channel " + (i + 1) + ": " + sample.channelData[i].toFixed(8) + " Volts.");

                // (-0.000000000, 0.00000000 ) son Volts
                cad += sample.channelData[i].toFixed(8) + ";";
            }
        });
    })

    // Funcion que se ejecutará cada vez se obtengan datos de los ochos canales

    // Funcion que se manda a llamar para iniciar la captura de datos
    function startCyton() {
        
    }

    // Funcion que detiene la captura de datos
    function stopCyton() {
        
    }
    