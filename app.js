let express=require('express');
let app=express();
let swig = require('swig');
let crypto = require('crypto');
app.set('clave','abcdefg');
app.set('crypto',crypto);

let fileUpload = require('express-fileupload');
app.use(fileUpload());

let bodyParser = require('body-parser');
let mongo = require('mongodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);
let expressSession = require('express-session');

app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

// routerUsuarioSession
var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
    console.log("routerUsuarioSession");
    if ( req.session.usuario ) {
        // dejamos correr la petición
        next();
    } else {
        console.log("va a : "+req.session.destino)
        res.redirect("/identificarse");
    }
});
//Aplicar routerUsuarioSession
app.use("/canciones/agregar",routerUsuarioSession);
app.use("/comentarios",routerUsuarioSession);
app.use("/publicaciones",routerUsuarioSession);
app.use("/cancion/comprar",routerUsuarioSession);
app.use("/compras",routerUsuarioSession);


//routerUsuarioAutor
let routerUsuarioAutor = express.Router();
routerUsuarioAutor.use(function(req, res, next) {
    console.log("routerUsuarioAutor");
    let path = require('path');
    let id = path.basename(req.originalUrl);
// Cuidado porque req.params no funciona
// en el router si los params van en la URL.
    gestorBD.obtenerCanciones(
        {_id: mongo.ObjectID(id) }, function (canciones) {
            console.log(canciones[0]);
            if(canciones[0].autor == req.session.usuario ){
                next();
            } else {
                res.redirect("/tienda");
            }
        })
});
//Aplicar routerUsuarioAutor
app.use("/cancion/modificar",routerUsuarioAutor);
app.use("/cancion/eliminar",routerUsuarioAutor);



//routerAudios
let routerAudios = express.Router();
routerAudios.use(function(req, res, next) {
    console.log("routerAudios");
    let path = require('path');
    let idCancion = path.basename(req.originalUrl, '.mp3');
    gestorBD.obtenerCanciones(
        {"_id": mongo.ObjectID(idCancion) }, function (canciones) {
            if(req.session.usuario && canciones[0].autor == req.session.usuario ){
                next();
            } else {
                let criterio = {
                    usuario : req.session.usuario,
                    cancionId : mongo.ObjectID(idCancion)
                };

                gestorBD.obtenerCompras(criterio ,function(compras){
                    if (compras != null && compras.length > 0 ){
                        next();
                    } else {
                        res.redirect("/tienda");
                    }
                });

            }
        })
});
//Aplicar routerAudios
app.use("/audios/",routerAudios);

let routerComentarios = express.Router();
routerComentarios.use(function(req, res, next) {
    console.log("routerAudios");
    let path = require('path');
    let idComentario = path.basename(req.originalUrl, '');
    gestorBD.obtenerComentarios(
        {"_id": mongo.ObjectID(idComentario) }, function (comentarios) {
            if(req.session.usuario && comentarios[0].autor == req.session.usuario ){
                next();
            } else {
                res.redirect("/cancion/" + comentarios[0].cancion_id.toString());
            }
        })
});

app.use("/comentarios/borrar",routerComentarios);




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
require("./routes/rcomentarios.js")(app,swig,gestorBD); // (app, param1, param2, etc.)


app.get('/', function (req, res) {
    res.redirect('/tienda');
})

app.listen(app.get('port'), function(){
    console.log("Servidor activo");

});