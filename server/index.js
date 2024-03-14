const express = require("express");
const app = express();
const port = 8000;
const mysql = require('mysql');
const config = require ('./config');

var connection = mysql.createConnection({
    host:config.db.host,
    port:config.db.port,
    user:config.db.user,
    password:config.db.password,
    database:config.db.database
})

connection.connect((err)=>{
    if(err){
        console.log("couldn't connect "+ err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
})


let server = app.listen(port,function(){
    console.log(`Server is running at http://localhost:${port}`);
})