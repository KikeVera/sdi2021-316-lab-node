module.exports = function(app, gestorBD) {

    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.get("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones[0]) );
            }
        });
    });

    app.delete("/api/cancion/:id", function(req, res) {
        let criterio = {
            "_id" : gestorBD.mongo.ObjectID(req.params.id),
            "autor": app.get("jwt").verify(req.headers.token, 'secreto').usuario
        }


        gestorBD.eliminarCancion(criterio,function(canciones){
            if ( canciones == null ){

                res.status(500);
                res.json({
                    error:"se ha producido un error"
                })
            } else {

                res.status(200);
                res.send(JSON.stringify(canciones));

            }
        });
    });

    app.post("/api/cancion", function(req, res) {

        let errores=[];
        let generos=["pop","golk","rock","reaggue","rap", "latino","blues","otros"];
        let nombrec=req.body.nombre;
        let generoc=req.body.genero;
        let precioc=req.body.precio;


        if(nombrec.trim()=="" || nombrec==null ){
            errores.push("El titulo de la canción es un campo obligatorio");
        }

        else{

            if(nombrec.length<3 || nombrec.length>30){
                errores.push("El nombre de la canción tiene que tener entre 3 y 30 caracteres");
            }

        }
        if( generoc.trim()==""||generoc==null ){
            errores.push("El genero de la canción es un campo obligatorio");
        }

        else{

            if(!generos.includes(generoc)){
                errores.push("El genero de la canción no es válido");
            }

        }

        if( precioc.trim()=="" || precioc==null){
            errores.push("El precio de la canción es un campo obligatorio");
        }

        else{
            if(precioc<0){
                errores.push("El precio debe ser positivo");
            }



        }


    if(errores.length==0) {
        let cancion = {
            nombre: req.body.nombre,
            genero: req.body.genero,
            precio: req.body.precio,
            autor: app.get("jwt").verify(req.headers.token, 'secreto').usuario
        }
        // ¿Validar nombre, genero, precio?


        gestorBD.insertarCancion(cancion, function (id) {
            if (id == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error",
                    errores:errores

                })
            } else {
                res.status(201);
                res.json({
                    errores:errores,
                    mensaje: "canción insertada",
                    _id: id
                })
            }
        });
    }

    else{
        res.status(200);
        res.json({
            error: "campos no válidos",
            errores:errores

        })

    }

    });

    app.put("/api/cancion/:id", function(req, res) {

        let criterio = {
            "_id" : gestorBD.mongo.ObjectID(req.params.id) ,
            "autor": app.get("jwt").verify(req.headers.token, 'secreto').usuario
        };

        let cancion = {}; // Solo los atributos a modificar

        let errores=[];
        let generos=["pop","golk","rock","reaggue","rap", "latino","blues","otros"];
        let nombrec=req.body.nombre;
        let generoc=req.body.genero;
        let precioc=req.body.precio;


        if(nombrec.trim()=="" || nombrec==null ){
            errores.push("El titulo de la canción es un campo obligatorio");
        }

        else{

            if(nombrec.length<3 || nombrec.length>30){
                errores.push("El nombre de la canción tiene que tener entre 3 y 30 caracteres");
            }

        }

        if( generoc.trim()==""||generoc==null ){
            errores.push("El genero de la canción es un campo obligatorio");
        }

        else{

            if(!generos.includes(generoc)){
                errores.push("El genero de la canción no es válido");
            }

        }
        if( precioc.trim()=="" || precioc==null){
            errores.push("El precio de la canción es un campo obligatorio");
        }

        else{
            if(precioc<0){
                errores.push("El precio debe ser positivo");
            }


        }

        if(errores.length==0) {
            cancion.nombre = req.body.nombre;
            cancion.genero = req.body.genero;
            cancion.precio = req.body.precio;


            gestorBD.modificarCancion(criterio, cancion, function (result) {
                if (result == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    res.status(200);
                    res.json({
                        mensaje: "canción modificada",
                        _id: req.params.id
                    })
                }
            });
        }

        else{
            res.status(200);
            res.json({
                error: "campos no válidos",
                errores:errores

            })

        }
    });


    app.post("/api/autenticar", function(req, res) {

        let seguro=app.get("crypto").createHmac('sha256', app.get('clave')).update(req.body.password).digest('hex');
        let criterio = {
            email: req.body.email,
            password: seguro
        }


        gestorBD.obtenerUsuarios(criterio, function(usuarios){
            if (usuarios == null || usuarios.length==0) {
                res.status(400);
                res.json({
                   autenticado : false
                })
            } else {
                let token = app.get('jwt').sign(
                    {usuario: criterio.email , tiempo: Date.now()/1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token : token
                });
            }
        });

    });






}