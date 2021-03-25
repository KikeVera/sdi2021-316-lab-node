let express=require('express');
let app=express();

app.set('port', 8081);

app.get('/usuarios', function(req,res){
    console.log("depurar aquí");
    res.send("ver usuarios");

});

app.get('/canciones', function(req,res){
    res.send("ver canciones");
});

app.listen(app.get('port'), function(){
    console.log("Servidor activo");

});