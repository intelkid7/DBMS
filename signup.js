var con = require("./main");
var express = require('express');
var app = express();

var bodyParse = require('body-parser');
const { CLIENT_IGNORE_SIGPIPE } = require("mysql/lib/protocol/constants/client");
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public/'));

con.connect(function(error){
    if(error) throw error;
    console.log("Successfully connected!");
});

app.get('/',function(req, res){
    res.sendFile(__dirname+'/signup.html');
});

app.post('/',function(req,res){
    var name = req.body.name;
    var shop_name = req.body.shop_name;
    var username = req.body.username;
    var email = req.body.email;
    var pass = req.body.pass;

    var sql = "INSERT INTO data_base VALUES('" + name + "','" + shop_name + "','"+ username + "','" + email +"','" + pass + "')";
    con.query(sql,function(err,res){
        if(err) throw err;
    });
    res.redirect('/signin');
});

app.get('/signin', function(req, res){
    res.sendFile(__dirname + "/login.html");
});

app.post('/signin', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    // console.log(username, ", ", password);
    con.query("select * from data_base where username = ? and pass = ? ;",[username, password], function(error,results,fields){
        // console.log(results);
        if (results.length > 0) {
            res.sendFile(__dirname+"/homepage.html");
        } 
        else{
            // alert("Login not found! Please signup");
            console.log("Login not found! Please signup");
            res.redirect("/signin");
        }
    });
});

app.listen(5500);