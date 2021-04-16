module.exports = function(app,swig,gestorBD) {
    app.post('/comentarios/:cancion_id', function(req, res) {


        let comentario = {
            autor: req.session.usuario,
            texto : req.body.texto,
            cancion_id : gestorBD.mongo.ObjectID(req.params.cancion_id)

        }

        // Conectarse
        gestorBD.insertarComentario(comentario, function(id){
            if (id == null) {
                es.redirect("/error?mensaje=Error al insertar comentario&tipoMensaje=alert-danger");
            } else {

                res.redirect('/cancion/'+req.params.cancion_id);

            }
        });


    });

    app.get('/comentarios/borrar/:id', function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };
        // Conectarse

        gestorBD.obtenerComentarios(criterio, function(comentarios){
            if (comentarios == null) {

                res.redirect("/error?mensaje=Error al recuperar comentario&tipoMensaje=alert-danger");
            } else {
                gestorBD.borrarComentario(criterio,function(id){

                    if ( id == null ){
                        res.redirect("/error?mensaje=Error al borrar comentario&tipoMensaje=alert-danger");
                    }

                    else {

                        res.redirect('/cancion/' + comentarios[0].cancion_id.toString());
                    }

                });



            }
        });


    });

};