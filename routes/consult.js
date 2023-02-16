var router = require('express').Router();
const User = require('../models/user');
const Doctor = require('../models/doctor');
const Speciality = require('../models/speciality');
const Consult= require('../models/consult');
const Chat= require('../models/chat');
var async=require('async');

router.post('/save',(req,res)=>{
    
    const{id,fname,lname,sex,age,speciality,message}=req.body;
    let errors =[];
      if(!fname||!lname||!sex||!age||!speciality||!message){
        errors.push({msg:'please fill in all fields!!!'});
      }
     
      if(errors.length>0){
            res.render('askdoc',{
              errors,id,fname,lname,sex,age,speciality,message
             });
      }
      else{
          let newconsult =new Consult({
                id,
                fname,
                lname,
                sex,
                age,
                speciality,
                message
              });

              async.waterfall([
                function(callback){
                  newconsult.save(function(err,room) {
                    cid=room._id;
                    if(err) return next(err);
             callback(null,cid);
                 });
                },
                function(cid,callback){
                  Doctor.find({speciality:req.body.speciality},(err,doctor)=>{
                    if(!err){
                      res.render("find",{
                        docs:doctor,
                        uid:id,
                        cid:cid
                      });
                    }
                      else{
                        console.log('error in retrieving data');
                      }
                  })
                }
              
              ])
              
                  
         };
       });


module.exports=router;