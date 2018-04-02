var net = require('net');
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var express = require('express');
var autoParse = require('auto-parse')
var app = express();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var http = require('http');
var fs = require('fs');
var engine = require('socket.io');
var HOST = '181.57.227.50';
var PORT = 5156;
var fetch = require('node-fetch');
    var FCM = require('fcm-node');
    var serverKey = 'AIzaSyC1w3xZWIaNiVGPJl2sBo7nSTXsMCE94VA'; //put your server key here
    var fcm = new FCM(serverKey);

var nodeExcel = require('excel-export-impr');

var moment = require('moment-timezone');
moment().tz("America/Bogota").format();



var key = 'AIzaSyBun6Af0_hIG5VwCm4YUHyaB4nrNsgh2z8';






app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(express.static('uploads'));

var jsonParser = bodyParser.json()


net.createServer(function(socke) {

  socke.on('data', function(data) {

    console.log("DD"+data);

    });

    socke.on('close', function(data) {
        console.log('CLOSED: ' + socke.remoteAddress +' '+ socke.remotePort);
    });

}).listen(5157, HOST);







net.createServer(function(sock) {

// We have a connection - a socket object is assigned to the connection automatically
console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

// Add a 'data' event handler to this instance of socket
sock.on('data', function(data) {

    // Write the data back to the socket, the client will receive it as data from the server

console.log('Datos '+data);

var dd = JSON.parse(data);

console.log("DDD"+dd.esnName);

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Esspia11',
  database : 'gps',
});

connection.connect();




connection.query('SELECT * from devices where uniqueid = ?',[dd.esnName], function (error, result, fields) {
  if (error) throw error;
  console.log('The solution is: ', result[0].id);

   connection.query('INSERT INTO positions SET ?', {deviceid: result[0].id, devicetime: new Date(), fixtime: new Date(), valid: 1, latitude: dd.latitude, longitude: dd.longitude, altitude: 0, speed: 0, course:14}, function (error, results, fields) {
      if (error) throw error;
  editardevice(results.insertId, dd.esnName);
//console.log(results.insertId);


//connection.end();


  });
//  res.send(result)


connection.end();

});




//////////////// MySQL | Begin ////////////////



});

// Add a 'close' event handler to this instance of socket
sock.on('close', function(data) {
    console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
});

}).listen(PORT, HOST);
// The sock object the callback function receives UNIQUE for each connection




function editardevice(insertId, device){

  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query('UPDATE devices SET lastupdate = ?, positionid = ? WHERE uniqueid = ?', [new Date(), insertId,  device], function (error, resul, fields) {
if (error) throw error;
// ...
//  console.log(resul.insertId);
});


connection.end();
}

function crc16Reflected(buf, crc_in, table) {
    var crc16 = crc_in;

    for (i = 0; i < buf.length; i++) {
        crc16 = table[(crc16 ^ buf[i]) & 0xff] ^ (crc16 >> 8);
    }

    return crc16 & 0xFFFF;
}

function crc16Ccitt(buf) {
    return crc16Reflected(buf, crc16CcittStart, crc16CcittTableReverse) ^ crc16CcittXorout;
}


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



let server = http.createServer(app).listen(5256, HOST, ()=>{
  console.log("Server in port 3000");
});


const io = engine.listen(server);

io.use(function(socket, next){
sessionMiddleware(socket.request, socket.request.res, next);
});

io.on('connection', (socket) => {

io.emit('data', "datos de la publicacion");

  socket.on('read', () => {

    //console.log();socket.request.session.userid







  })


  socket.on('login', () => {



  })



});

app.get('/', function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});



app.get('/token/:token/:iduser', jsonParser, function(req, res){

  console.log(req);

  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query('UPDATE users SET firebase = ? where id = ? ', [req.params.token, req.params.iduser], function (error, resul, fields) {
if (error) throw error;
// ...
//  console.log(resul.insertId);
});


connection.end();


res.send("exito");
});



//Notificaciones
app.get('/gprmc/Data/:id/:code/:gprmc/:latitude/:longitude', function(req, res){


  //console.log(req);

  var myObj = JSON.parse(req.params.gprmc);
  console.log(myObj.alarm);

  if(myObj.alarm == "sos"){


    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'Esspia11',
      database : 'gps',
    });

    connection.query('SELECT * FROM devices JOIN user_device ON (devices.id = user_device.deviceid) JOIN users ON (user_device.userid = users.id) WHERE user_device.deviceid = ?',[req.params.id], function (error, result, fields) {
      if (error) throw error;
      console.log('The solution is: ', result.length);

      for (i = 0; i < result.length; i++) {
        connection.query('INSERT INTO notificaciones SET ?', {deviceid: req.params.id, userid: result[i].userid,  latitude: req.params.latitude, longitude: req.params.longitude, firebase: result[i].firebase}, function (error, results, fields) {
           if (error) {
             console.log(error);
           }else{

          enviarnotificacion(results.insertId);


           }




       });

}


    //  res.send(result)


    connection.end();

    });









  }




res.send("exito");



  //console.log(req.params.gprmc.ignition);
  //console.log(req.params.gprmc);

});

//fin de notificaciones
function enviarnotificacion(insertId){

  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query('SELECT * FROM notificaciones WHERE id = ? ', [insertId], function (error, resul, fields) {
if (error) throw error;
// ...
  console.log(resul[0]);
  var to = resul[0].firebase;

  var notification = {
    'title': 'Alerta de Panico',
    'body': 'El dispositivo esta en panico',
    'cordenadas': '3.45154, -76.2545',
    "sound" : "default",
    "click_action": "OPEN_ACTIVITY_1",

  };

  var data =  {
  "body": insertId,
};

  fetch('https://fcm.googleapis.com/fcm/send', {
    'method': 'POST',
    'headers': {
      'Authorization': 'key=' + key,
      'Content-Type': 'application/json'
    },
    'body': JSON.stringify({
      'notification': notification,
      'data': data,
      'to': to
    })
  }).then(function(response) {
   // console.log(response);
  }).catch(function(error) {
    console.error(error);
  })
});


connection.end();
}



app.get('/ultimasposiciones/:id/:fecha', function(req, res){

  console.log("ID"+req.params.id);
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
    timezone: 'utc'
  });

  connection.connect();

  connection.query("SELECT * FROM positions JOIN devices ON (devices.id = positions.deviceid)  WHERE devices.id = ? AND positions.servertime LIKE '%"+req.params.fecha+"%' ORDER BY positions.id DESC LIMIT 200 ",[req.params.id], function (error, results, fields) {
    if (error) throw error;
    ///console.log('The : ', results[0]);

  if(typeof results[0] == "undefined"){
    res.send("");
    //console.log("error");
  }else{
    res.send(results);
    console.log(new Date());
    //console.log("exito");
  }



  });

  connection.end();
});
//Notificaciones android
app.get('/notificaciones/:id', function(req, res){

  //console.log("ID"+req.params.id);
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query('SELECT * FROM notificaciones JOIN devices ON (notificaciones.deviceid = devices.id)  WHERE notificaciones.userid =  ? ORDER BY notificaciones.id DESC',[req.params.id], function (error, results, fields) {
    if (error) throw error;
  //  console.log('The : ', results[3].uniqueid);
    res.send(results)
//console.log(results.length);


  });

  connection.end();
});

//fin notificaciones android

app.get('/posiciones/:id', function(req, res){

  //console.log("ID"+req.params.id);
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query('SELECT * FROM devices JOIN user_device ON (devices.id = user_device.deviceid) JOIN positions ON (positions.id = devices.positionid) WHERE user_device.userid = ?',[req.params.id], function (error, results, fields) {
    if (error) throw error;
  //  console.log('The : ', results[3].uniqueid);
    res.send(results)
//console.log(results.length);


  });

  connection.end();
});


app.get('/geocerca/:id/:type', function(req, res){

//  console.log("ID"+req.params.id);
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query('SELECT * FROM events JOIN geofences ON (events.geofenceid = geofences.id) WHERE events.deviceid = ? AND events.type = ?', [req.params.id, req.params.type],function (error, results, fields) {
    if (error) throw error;
    //console.log('The : ', results);
    res.send(results)



  });

  connection.end();
});


app.get('/encendidos/:id/:type', function(req, res){

//  console.log("ID"+req.params.id);
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query('SELECT * FROM events JOIN devices ON (devices.id = events.deviceid) WHERE events.deviceid = ? AND events.type = ?', [req.params.id, req.params.type],function (error, results, fields) {
    if (error) throw error;
    console.log('The : ', results[0].id);

    if(typeof results[0] == "undefined"){
      res.send("");
      //console.log("error");
    }else{
      res.send(results);
    //  console.log("exito");
    }




  });

  connection.end();
});

//encendido android

app.get('/encendidoss/:id/:type/:fecha', function(req, res){

//  console.log("ID"+req.params.id);
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query('SELECT * FROM events JOIN devices ON (devices.id = events.deviceid)  JOIN positions ON(events.deviceid = positions.id) WHERE events.deviceid = ? AND events.type = ? AND events.servertime LIKE "%'+req.params.fecha+'%"', [req.params.id, req.params.type],function (error, results, fields) {
    if (error) throw error;
    //console.log('The : ', results[0]);

    if(typeof results[0] == "undefined"){
      res.send("");
      //console.log("error");
    }else{
      res.send(results);
    //  console.log("exito");
    }




  });

  connection.end();
});

//fin encendido android


app.get('/panico/:id/:fecha', function(req, res){

//  console.log("ID"+req.params.id);
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query('SELECT * FROM positions JOIN devices ON (devices.id = positions.deviceid) WHERE positions.attributes LIKE "%SOS%"  AND  positions.servertime LIKE "%'+req.params.fecha+'%" AND positions.deviceid = ? ORDER BY positions.id DESC ', [req.params.id],function (error, results, fields) {
    if (error) throw error;
    //console.log('The : ', fields);



    if(typeof results[0] == "undefined"){
      res.send("");
    //  console.log("error");
    }else{
      res.send(results);
    //  console.log("exito");
    }





  });

  connection.end();
});



app.get('/puerta/:id/:type', function(req, res){

//  console.log("ID"+req.params.id);
if(req.params.type == "dooropen"){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query(`SELECT * FROM positions JOIN devices ON (devices.id = positions.deviceid) WHERE positions.attributes LIKE '%"door":true%' AND positions.deviceid = ? ORDER BY positions.id DESC `, [req.params.id],function (error, results, fields) {
    if (error) throw error;
    //console.log('The : ', results);
    res.send(results)



  });
}else if(req.params.type == "doorclouse"){

  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query(`SELECT * FROM positions JOIN devices ON (devices.id = positions.deviceid) WHERE positions.attributes LIKE '%"door":false%' AND positions.deviceid = ? ORDER BY positions.id DESC `, [req.params.id],function (error, results, fields) {
    if (error) throw error;
    //console.log('The : ', results);
    res.send(results)



  });

}

  connection.end();
});



//puertas android

app.get('/puertas/:id/:type/:fecha', function(req, res){

//  console.log("ID"+req.params.id);
if(req.params.type == "dooropen"){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query(`SELECT * FROM positions JOIN devices ON (devices.id = positions.deviceid) WHERE positions.attributes LIKE '%"door":true%' AND positions.deviceid = ? AND positions.servertime LIKE '%`+req.params.fecha+`%' ORDER BY positions.id DESC `, [req.params.id],function (error, results, fields) {
    if (error) throw error;
    //console.log('The : ', results);
    res.send(results)



  });
}else if(req.params.type == "doorclouse"){

  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query(`SELECT * FROM positions JOIN devices ON (devices.id = positions.deviceid) WHERE positions.attributes LIKE '%"door":true%' AND positions.deviceid = ? AND positions.servertime LIKE '%`+req.params.fecha+`%' ORDER BY positions.id DESC`, [req.params.id],function (error, results, fields) {
    if (error) throw error;
    //console.log('The : ', results);
    res.send(results)



  });

}

  connection.end();
});

//fin puertas android


app.get('/edituser/:id', function(req, res){

//  console.log("ID"+req.params.id);

  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query(`SELECT * FROM users WHERE id = ?`, [req.params.id],function (error, results, fields) {
    if (error) throw error;
    //console.log('The : ', results);
    res.send(results)



  });

  connection.end();
});

app.post('/editarusuario/:id', upload.fields([{ name: 'fondo', maxCount: 1 }, { name: 'logo', maxCount: 8 }]), function(req, res){

var namefondo = "";
var namelogo = "";
  var f = new Date();
  var fecha = f.getDate()+""+(f.getMonth())+"" +f.getFullYear()+""+f.getHours()+""+f.getMinutes()+""+f.getSeconds()+""+f.getMilliseconds();

  if (typeof req.files.fondo !== 'undefined') {
    // your code here

   var tmp_path = req.files.fondo[0].path;



   //console.log(tmp_path);

    /** The original name of the uploaded file
        stored in the variable "originalname". **/








var target_path = 'uploads/' + "fondo"+fecha+".jpg";

namefondo = target_path;

    /** A better way to copy the uploaded file. **/
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    //src.on('end', function() { res.send('complete'); });
  //  src.on('error', function(err) { res.send('error'); });
  }

    if (typeof req.files.logo !== 'undefined') {

var tmp_pathl = req.files.logo[0].path;
var target_pathl = 'uploads/' +"logo"+fecha+".jpg";

namelogo = target_pathl;

    var srcl = fs.createReadStream(tmp_pathl);
    var destl = fs.createWriteStream(target_pathl);
    srcl.pipe(destl);
    srcl.on('end', function() {  });
    srcl.on('error', function(err) { res.send('error'); });

}


if(namelogo == ""){
  namelogo = req.body.logos;
}
if(namefondo == ""){
  namefondo = req.body.fondos;
}


console.log(namelogo);

console.log(namefondo);


//  console.log("ID"+req.params.id);

  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query('UPDATE users SET nombre_empresa = ?, nit = ?, gerente= ?, direccion=?, ciudad=?, logo=?, fondo=? where id = ? ', [req.body.nombre_empresa, req.body.nit, req.body.gerente, req.body.direccion, req.body.ciudad, namelogo.replace("uploads/", ""), namefondo.replace("uploads/", ""), req.body.id],function (error, results, fields) {
    if (error) throw error;
    //console.log('The : ', results);
    res.send('complete');



  });

  connection.end();
});




app.get('/editdevice/:id', function(req, res){

//  console.log("ID"+req.params.id);

  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query(`SELECT * FROM devices WHERE id = ?`, [req.params.id],function (error, results, fields) {
    if (error) throw error;
    //console.log('The : ', results);
    res.send(results)



  });

  connection.end();
});




app.post('/editardevice/:id', upload.fields([{ name: 'img', maxCount: 1 }, { name: 'foto', maxCount: 8 }]), function(req, res){

var namefondo = "";
var namelogo = "";
  var f = new Date();
  var fecha = f.getDate()+""+(f.getMonth())+"" +f.getFullYear()+""+f.getHours()+""+f.getMinutes()+""+f.getSeconds()+""+f.getMilliseconds();

  if (typeof req.files.img !== 'undefined') {
    // your code here

   var tmp_path = req.files.img[0].path;



   //console.log(tmp_path);

    /** The original name of the uploaded file
        stored in the variable "originalname". **/








var target_path = 'uploads/img/' + "img"+fecha+".jpg";

namelogo = target_path;

    /** A better way to copy the uploaded file. **/
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    //src.on('end', function() { res.send('complete'); });
  //  src.on('error', function(err) { res.send('error'); });
  }

    if (typeof req.files.foto !== 'undefined') {

var tmp_pathl = req.files.foto[0].path;
var target_pathl = 'uploads/img/' +"foto"+fecha+".jpg";

namefondo = target_pathl;

    var srcl = fs.createReadStream(tmp_pathl);
    var destl = fs.createWriteStream(target_pathl);
    srcl.pipe(destl);
    srcl.on('end', function() {  });
    srcl.on('error', function(err) { res.send('error'); });

}


if(namelogo == ""){
  namelogo = req.body.img;
}
if(namefondo == ""){
  namefondo = req.body.foto;
}


console.log(namelogo);

console.log(namefondo);


//  console.log("ID"+req.params.id);

  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Esspia11',
    database : 'gps',
  });

  connection.connect();

  connection.query('UPDATE devices SET name = ?, uniqueid = ?, phone= ?, img=?, foto=?  where id = ? ', [req.body.name, req.body.uniqueid, req.body.phone,   namelogo.replace("uploads/img/", ""), namefondo.replace("uploads/img/", ""), req.body.id],function (error, results, fields) {
    if (error) throw error;
    //console.log('The : ', results);
    res.send('complete');



  });

  connection.end();
});



app.get('/Excel', function(req, res){
  	var conf ={};
  	conf.cols = [{
		caption:'string',
        type:'string',
        beforeCellWrite:function(row, cellData){
			 return cellData.toUpperCase();
		}
	},{
		caption:'date',
		type:'date',
		beforeCellWrite:function(row, cellData){
			var originDate = new Date(Date.UTC(1899, 12, 29));
			return function(row, cellData){
			  return (cellData - originDate) / (24 * 60 * 60 * 1000);
			}
		}()
	},{
		caption:'bool',
		type:'bool'
	},{
		caption:'number',
		 type:'number'
  	},
	{
		caption:'link',
		type:'hyperlink'
	}];
  	conf.rows = [
 		['pi', new Date(Date.UTC(2013, 4, 1)), true, 3.14, { text: 'Google', href: 'http://www.google.com'}],
 		['pi', (new Date(2013, 4, 1)).getJulian(), true, 3.14, { text: 'Google', href: 'http://www.google.com'}],
		["e", (new Date(2012, 4, 1)).getJulian(), false, 2.7182, { text: 'Google', href: 'http://www.google.com'}]
  	];
  	var result = nodeExcel.execute(conf);
  	res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  	res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
  	res.end(result, 'binary');
});

app.listen(9000);
