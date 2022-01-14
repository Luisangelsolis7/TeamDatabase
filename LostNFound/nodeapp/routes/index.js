var express = require('express');
const db = require("../database");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/lostform', function(req, res, next) {
  res.render('lostform');
});

router.post('/create', function(req, res, next) {
  // store all the item input data
  let firstName = req.body.firstname;
  let lastName = req.body.lastname;
  let itemName = req.body.itemname;
  let itemCat = req.body.itemcat;
  let itemDesc = req.body.itemdesc;
  let itemValue = req.body.itemvalue;

  //Store all status data
  let location = req.body.itemlocation;
  let date = req.body.itemdate;
  let time = req.body.itemtime;



  // insert item data into item table
  let sql = `Insert into User (UserID, User_Fname, User_Lname) Values (null, '${firstName}', '${lastName}')`;
  db.query(sql, function (err, result1){
    if(err) throw err;
    console.log("User added");
    let user_id = result1.insertId;
  sql = `INSERT INTO Item (ItemID, Item_Catagory, ItemName, ItemDesc, ItemValue)
      VALUES(null, '${itemCat}', '${itemName}', '${itemDesc}', ${itemValue})`;
  db.query(sql,function (err, result2) {
    if (err) throw err;
    console.log("Item is inserted successfully ");
    let item_id = result2.insertId;
    sql = `Insert into Item_Status_History(ItemID_FK, StatusID_FK, Location, Date, Time, UserID_FK ) 
    Values (${item_id}, 'Lost', '${location}', '${date}', '${time}', ${user_id})`
    db.query(sql, function (err){
      if(err) throw err;
      console.log("Item Status Inserted!");
    })
  })
});


  res.redirect('/lostform');  // redirect to user form page after inserting the data
});

module.exports = router;
