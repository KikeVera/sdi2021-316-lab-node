module.exports = function(app,swig) {
    let autoresNuevos=[];
    app.get("/usuarios", function(req, res) {
        res.send("ver usuarios");
    });

    app.get('/autores/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/autores-agregar.html', {

        });
        res.send(respuesta);
    });

    app.post('/autores/agregar', function(req, res) {



        let autor={
            "nombre" : req.body.nombre,
            "grupo" : req.body.grupo,
            "rol" : req.body.rol
        };

        if(req.body.nombre==""){
            autor.nombre="Nombre desconocido";

        }

        if(req.body.grupo==""){
            autor.grupo="Grupo desconocido";

        }

        autoresNuevos.push(autor);
        res.redirect('/autores/');
    });

    app.get("/autores/", function(req, res) {

        let autores =[
            {
                "nombre" : "Brad Delson",
                "grupo" : "Linkin Park",
                "rol" : "guitarrista"
            },
            {
                "nombre" : "Mike Dirnt ",
                "grupo" : "Green day",
                "rol" : "bajista"
            },

            {
                "nombre" : "Dexter Holland ",
                "grupo" : "The Offspring",
                "rol" : "cantante"
            }
        ];
        let i=0;
        for(i=0;i<autoresNuevos.length;i++){
            autores.push(autoresNuevos[i]);
        }

        let respuesta = swig.renderFile('views/autores.html',{
            vendedor: 'Tienda de canciones',
            autores:autores

        });

        res.send(respuesta);

    });

    app.get('/autores/*', function (req, res) {
        res.redirect('/autores/');
    })

};