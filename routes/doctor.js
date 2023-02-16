var router = require('express').Router();
const User = require('../models/user');
const Doctor = require('../models/doctor');
const Speciality = require('../models/speciality');
var async=require('async');

//Special case starts here-----------------
router.get('/profile/:id',(req,res,next)=>{

   async.waterfall([
       function(callback){
        User.find({_id: req.params.id},(err,user)=>{
            if(err) return next(err);
            callback(null,user);
        });
       },
       function(user,callback){
        Speciality.find((err,docs)=>{
            res.render("doctor/profile",{
                list:docs ,
                user:user
            })
              
        });
       },
   ]);
   
    });

//Special case end here--------------------

    router.post('/docprofile',(req,res)=>{
    
        const{did,fname,lname,sex,age,category,speciality,experience,address}=req.body;

                 let newuser =new Doctor({
                   did,
                  fname,
                  lname,
                  sex,
                  age,
                  category,
                  speciality,
                  experience,
                  address
                  });
                  //Hash password
                
                    newuser.save()
                    .then(user =>{
                        
                      res.redirect('/dashboard');
                    })
                    .catch(err =>console.log(err));
                  
            
         });
      
         router.get('/profile1',(req,res)=>{
          User.find((err,docs)=>{
            if(!err){
              res.render("dashboard",{
                list:docs
              });
            }
              else{
                console.log('error in retrieving data');
              }
          });
             
        });

 module.exports=router;