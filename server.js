var con = require("./main");
var express = require('express');
var app = express();
// let ejs = require('ejs');

var bodyParse = require('body-parser');
const { CLIENT_IGNORE_SIGPIPE } = require("mysql/lib/protocol/constants/client");
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public/'));

app.set('view engine','ejs');
// app.set('view','view');

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

app.get('/inventory', function(req, res){
    var user_id = 1;

    con.query("select * from inventory where user_id = ? ;", [user_id], function(error, results){
        console.log(results);
        res.render(__dirname + '/inventory', {inventory:results});
    })
})

app.post('/inventory',function(req, res){
    var user_id = 1
    var pname = req.body.pname;
    var ppu = req.body.ppu;
    var pqty = req.body.pqty;
    con.query("select * from inventory value where pname = ?",[pname], function(erorr, results, fields){
        if (results.length > 0){
            con.query("update inventory set ppu = ?, pqty = pqty + ? where user_id = ? and pname = ?",[ppu, pqty,user_id,pname]);
            res.redirect('/inventory');
        }
        else{
            con.query("insert into inventory values('" + user_id + "','" + pname + "','"+ ppu + "','" + pqty +"')");
            res.redirect('/inventory');
        }
    })
});


app.get('/makebill', function(req,res){
    var user_id = 1;
    var pname = req.body.pname;
    var qtyb = req.body.qtyb;
    var ppu = req.body.ppu;

    res.sendFile(__dirname + '/billing.ejs');

    // con.query("insert into ");
});

app.post('/makebill', function(req, res){
    var pname = req.body.pname

    con.query("select * from products where pname like ?;", [pname[0]] + '%', function(error, results, fields){
        console.log(results);
    })
});

app.listen(5500);
