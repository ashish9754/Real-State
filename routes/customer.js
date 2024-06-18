//jshint esversion:6
const express = require('express');
const router = require('express').Router();
const customer = require('../controllers/customer.controller');
router.use(express.static("public"));

let Owner = require('../models/owner');
let Customer = require('../models/customer');
let Property = require('../models/property');
let Registration = require('../models/registration');
let Loan = require('../models/loan');
let Testimonial = require('../models/testimonial');
let Transaction = require('../models/transaction');
let Cancellation = require('../models/cancellation');

router.get("/login", function(req, res){
    res.sendFile(__dirname +'/clogin.html');
  });

router.post("/register", customer.register);

router.get("/home", function(req, res){
    res.render("customer/home");
  });

router.post("/regsub", function(req, res){
    let customer = new Customer();
    cid=cid+1;
    console.log(cid);
    console.log(req.body);
    customer.customerid = cid;
    customer.emailid=req.body.emailid;
    customer.customerpassword=req.body.customerpassword;
    customer.firstname=req.body.customername;
    customer.firstname=req.body.firstname;
    customer.middlename=req.body.middlename;
    customer.lastname=req.body.lastname;
    customer.dateofbirth=req.body.dateofbirth;
    customer.phonenumber=req.body.phonenumber;
    customer.occupation=req.body.occupation;
    customer.annualincome=req.body.annualincome;
    customer.address=req.body.address;

    customer.save(function(err,customer){
        if (!err){
            console.log("Saved customer to DB");
            res.redirect("/customer/login");
        }
        else{
            console.log(err);
                if (err.name == 'ValidationError') {
                    handleValidationError(err, req.body);
                    res.render("customer/register", {
                        viewTitle: "Customer Registration Form",
                        customer: req.body
                    });
                }
                else
                    console.log('Error during record insertion : ' + err);
            }
    });
  });


router.post("/login", function(req, res){
    console.log(req.body.customerid);
    console.log(req.body.password);
    let id=req.body.customerid;
    let pass=req.body.password;
    Customer.findOne({customerid:id},function(err,customer){
        if(err){
            console.log(err);
        }else{
            console.log(customer.customerpassword);
            if(customer.customerpassword==pass){
                res.redirect("/customer/home");
            }
        }
    }
  
    );
  });


  router.get('/propertylist', (req, res) => {
    Property.find({})
    .sort({ _id: -1 })    
    .lean()
        .then(docs=>{
            res.render("customer/propertylist", {
                list: docs
            });
        })
        .catch(err=>console.log("Error retrieving list.", err))
});




let rid=4110;
 router.post('/registrationsub', (req, res) => {
     let registration = new Registration();
     rid=rid+1;
     console.log(req.body);
     registration.registrationid = rid;
     registration.propertyname = req.body.propertyname;
     registration.customername = req.body.customername;
     registration.registrationdate = req.body.registrationdate;
     registration.registrationstatus = req.body.registrationstatus;
     registration.save(function(err,property){
     if (!err){
         console.log("Saved registration to DB");
         res.redirect("/customer/propertylist");
     }
     else{
                 console.log('Error during record insertion : ' + err);
         }
       });

 });





















let field;
function handleValidationError(err, body) {
      for (field in err.errors) {
          switch (err.errors[field].path) {
              case 'address':
                  body.addressError= err.errors[field].message;
                  break;
              case 'annualincome':
                  body.annualincomeError= err.errors[field].message;
                  break;
              case 'occupation':
                  body.occupationError= err.errors[field].message;
                  break;
              case 'phonenumber':
                  body.phonenumberError= err.errors[field].message;
                  break;
              case 'dateofbirth':
                  body.dateofbirthError= err.errors[field].message;
                  break;
              case 'lastname':
                  body.lastnameError= err.errors[field].message;
                  break;
              case 'emailid':
                  body.emailError= err.errors[field].message;
                  break;
              case 'firstname':
                  body.firstnameError= err.errors[field].message;
                  break;
 
          }
      }
  } 

module.exports = router;
