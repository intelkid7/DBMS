var mysql = require("mysql");

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Hasumatiben@0102",
    database:"login"
});

module.exports = con;

// con.connect(function(error){
//     if(error) throw error;
//     console.log("Connected Succesfully!");
// });