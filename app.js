let express=require('express');
let app=express();
let swig = require('swig');

let bodyParser = require('body-parser');
let mongo = require('mongodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

app.use(express.static('public'));



app.set('port', 8081);
app.set('db','mongodb://admin:19111996@tiendademusica-shard-00-00.ixolh.mongodb.net:27017,' +
        'tiendademusica-shard-00-01.ixolh.mongodb.net:27017,tiendademusica-shard-00-02.' +
        'ixolh.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-121407-' +
        'shard-0&authSource=admin&retryWrites=true&w=majority');



//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app,swig,gestorBD); // (app, param1, param2, etc.)
require("./routes/rcanciones.js")(app,swig,gestorBD); // (app, param1, param2, etc.)
require("./routes/rautores.js")(app,swig,gestorBD); // (app, param1, param2, etc.)




app.listen(app.get('port'), function(){
    console.log("Servidor activo");

});