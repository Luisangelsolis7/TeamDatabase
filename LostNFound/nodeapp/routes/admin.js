let express = require('express');
let router = express.Router();
let db = require('../database');
// another routes also appear here
// this script to fetch data from MySQL databse table

router.get('/logform', function(req, res, next) {
  res.render('logform');
});

router.get('/claim/:id', function(req, res, next) {
  let itemID = req.params.id;
  console.log(itemID);
  let sql = `Select * From Item_Status_History where ItemID_FK=${itemID} and StatusID_FK = 'Found'`;
  db.query(sql, function (err, data){
    if (err) throw err;
    res.render('claimform', {editData:data[0]});
  })
});

router.post('/claim/:id', function(req, res, next) {
  let itemID = req.params.id;
  console.log(itemID);
  let userFName = req.body.firstname;
  let userLName = req.body.lastname;
  let date = req.body.claimdate;
  let time = req.body.claimtime;
  let driverLicense  = req.body.driverLicense;

  let sql = `Insert into User(UserID, User_Fname, User_Lname, DriverLicenseNumber) 
                VALUES (null, '${userFName}', '${userLName}', '${driverLicense}')`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    let userid = result.insertId;

    console.log(itemID);
    console.log("User Added");
    sql = `Insert into Item_Status_History (ItemID_FK, StatusID_FK, Date ,Time, UserID_FK) 
            Values('${itemID}', 'Claimed', '${date}', '${time}', ${userid})`;
    db.query(sql, function (err){
      if(err) throw err;
      console.log("Item successfully claimed!")
    })


  });
  res.redirect('/admin/claimed');
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


  res.redirect('/admin/logform');  // redirect to user form page after inserting the data
});


router.get('/unclaimed', function(req, res, next) {
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
    res.render('unclaimed', { title: 'Unclaimed Items', userData: data});
  });
});

router.get('/lost', function(req, res, next) {
  let sql = `SELECT i.ItemID, c.CategoryName, i.ItemName, i.ItemValue, i.ItemDesc, ish.StatusID_FK, ish.Location, ish.Date, ish.Time, u.User_Fname, u.User_Lname, u.User_DOB, u.DriverLicenseNumber
  FROM (Select h.ItemID_FK, h.Date, h.StatusID_FK, h.UserID_FK, h.Location, h.Time
  From Item_Status_History h,
      (Select ItemID_FK, MAX(Date) as mdate from Item_Status_History
  Group by ItemID_FK) t
  where t.ItemID_FK = h.ItemID_FK and t.mdate = h.date) ish
  Join Item i
  on i.ItemID = ish.ItemID_FK
  Left Join User u
  on u.UserID = ish.UserID_FK
  join Category c
  on i.Item_Catagory = c.CategoryID
  Where ish.StatusID_FK = 'Lost'
  Order by ish.Date DESC`;
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('lost', { title: 'Lost Items', userData: data});
  });
});

router.get('/claimed', function(req, res, next) {
  let sql = `SELECT i.ItemID, c.CategoryName, i.ItemName, i.ItemValue, i.ItemDesc, ish.StatusID_FK, ish.Location, ish.Date, ish.Time, u.User_Fname, u.User_Lname, u.User_DOB, u.DriverLicenseNumber, o.BadgeNumber, o.Officer_Lname
  FROM (Select h.ItemID_FK, h.Date, h.StatusID_FK, h.UserID_FK, h.Location, h.Time, h.OfficerID_FK
  From Item_Status_History h,
      (Select ItemID_FK, MAX(Date) as mdate from Item_Status_History
  Group by ItemID_FK) t
  where t.ItemID_FK = h.ItemID_FK and t.mdate = h.date) ish
  Join Item i
  on i.ItemID = ish.ItemID_FK
  Left Join User u
  on u.UserID = ish.UserID_FK
  Left Join Officer o 
  on o.BadgeNumber = ish.OfficerID_FK
  join Category c
  on i.Item_Catagory = c.CategoryID
  Where ish.StatusID_FK = 'Claimed'
  Order by ish.Date DESC`;
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('claimed', { title: 'Lost Items', userData: data});
  });
});


module.exports = router;
