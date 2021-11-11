let mysql = require('mysql');
let express = require('express');
let router = express.Router();

let con = mysql.createConnection({
    host: "45.55.136.114",
    user: "teamDB_F2021",
    password: "no1inTeam!",
    database: "teamDB_F2021"
});


let data = getData(con)

function getData(con) {
    let sql = 'SELECT * FROM Found';
    con.connect(function (err){
    con.query(sql,function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
});

}




