let express = require('express');
let router = express.Router();
let db = require('../database');
// another routes also appear here
// this script to fetch data from MySQL databse table

router.get('/form', function(req, res, next) {
  res.render('users');
});

router.post('/create', function(req, res, next) {
  // store all the item input data
  let itemCat = req.body.itemcat;
  let itemName = req.body.itemname;
  let itemDesc = req.body.itemdesc;
  let itemValue = req.body.itemvalue;

  //Store all status data
  let location = req.body.itemlocation;
  let date = req.body.itemdate;
  let time = req.body.itemtime;



  // insert item data into item table
  let sql = `INSERT INTO Item (ItemID, Item_Catagory, ItemName, ItemDesc, ItemValue)
      VALUES(null, '${itemCat}', '${itemName}', '${itemDesc}', ${itemValue})`;
  db.query(sql,function (err, result) {
    if (err) throw err;
    console.log("Item is inserted successfully ");
    let id = result.insertId;
    sql = `Insert into Item_Status_History(ItemID_FK, StatusID_FK, Location, Date, Time) 
    Values (${id}, 'Found', '${location}', '${date}', '${time}')`
    db.query(sql, function (err){
      if(err) throw err;
      console.log("Item Status Inserted!");
    })
  });


  res.redirect('/users/form');  // redirect to user form page after inserting the data
});


router.get('/user-list', function(req, res, next) {
  let sql = `SELECT i.ItemID, c.CategoryName, i.ItemName, i.ItemValue, i.ItemDesc, ish.StatusID_FK, ish.Location, ish.Date, ish.Time, o.BadgeNumber, o.Officer_Lname
  FROM (Select h.ItemID_FK, h.Date, h.StatusID_FK, h.OfficerID_FK, h.Location, h.Time
  From Item_Status_History h,
      (Select ItemID_FK, MAX(Date) as mdate from Item_Status_History
  Group by ItemID_FK) t
  where t.ItemID_FK = h.ItemID_FK and t.mdate = h.date) ish
  Join Item i
  on i.ItemID = ish.ItemID_FK
  Left Join Officer o
  on o.BadgeNumber = ish.OfficerID_FK
  join Category c
  on i.Item_Catagory = c.CategoryID
  Where ish.StatusID_FK = 'Found'
  Order by ish.Date DESC`;
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('user-list', { title: 'User List', userData: data});
  });
});


module.exports = router;
