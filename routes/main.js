const express = require('express');
var async=require('async');

const router = express.Router();
const mongoose = require('mongoose');
const stripe = require('stripe')('sk_test_BQokikJOvBiI2HlWgH4olfQ2');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

var publicDir = require('path').join(__dirname,'/public');
const app = express(); 
app.use(express.static(publicDir));

const User = require('../models/user');
const Doctor = require('../models/doctor');
const Speciality = require('../models/speciality');
const Consult= require('../models/consult');
const Chat= require('../models/chat');
const { SSL_OP_CISCO_ANYCONNECT } = require('constants');

router.use('/doctor',require('./doctor'));

router.use('/consult',require('./consult'));
//>-----------------Routes are here----------------------<
 
 router.get('/',(req,res)=>{
    res.render('home');
    });
    
    router.get('/askdoc/:id',(req,res,next)=>{

      async.waterfall([
          function(callback){
           User.find({_id: req.params.id},(err,user)=>{
               if(err) return next(err);
               callback(null,user);
           });
          },
          function(user,callback){
           Speciality.find((err,docs)=>{
               res.render("askdoc",{
                   list:docs ,
                   user:user
               })
                 
           });
          },
      ]);
      
       });
    
   
  router.get('/dashboard',(req,res)=>{
    res.render('dashboard',{
      user: req.user
    });
    });

  

 //-------------------------payment routes------------------------//
 router.get('/payment',(req,res)=>{
  res.render('payment');
  });
 
  router.post('/payment/:id',function(req,res){
    var token=req.body.stripeToken;
    var chargeAmount=req.body.chargeAmount;
    var charge=stripe.charges.create({
      amount:chargeAmount,
      currency:"inr",
      source:token
    },function(err,charge){
      if(err &err.type=="StripeCardError"){
        console.log("Your card was declined");
      }
    });
    User.findOne(
      { _id: req.params.id },(err,doc)=>{
         doc.prime=1;
         doc.save();
         console.log("Your payment successful")
         res.redirect('/dashboard');
     }
   )
    
  });

  router.get('/success',(req,res)=>{
    res.render('success');
    });
 //--------------------------------------------------------------------//

 router.get('/find',(req,res)=>{
  res.render('find');
  });

  router.get('/consult/askchat/:cid/:did',(req,res)=>{

    async.waterfall([
      function(callback){
       Consult.find({_id: req.params.cid},(err,user)=>{
           if(err) return next(err);
           callback(null,user);
       });
      },
      function(user,callback){
        console.log(user);
       Doctor.find({did:req.params.did},(err,docs)=>{
           res.render("askchat",{
               list:docs ,
               user:user
           })
             
       });
      },
  ]);
    });



    router.post('/surf',(req,res)=>{
      const{cid,did,fname,lname,sex,age,speciality,message}=req.body;
      console.log(cid);
      async.waterfall([
        function(callback){
          Consult.find({_id: cid},(err,user)=>{
              if(err) return next(err);
              callback(null,user);
          });
         },
        function(user,callback){
          let token=cid;
          let id=user[0].id;
          let ur=1;
          let newchat =new Chat({token,id,ur,message});
          newchat.save(function(err,vroom) {
            if(err) return next(err);
     callback(null,cid);
         });
        },
        function(cid,callback){
          Consult.findOne(
            { _id: cid },(err,doc)=>{
               doc.message=message;
               doc.assign=did;
               doc.save();
               res.redirect("/dashboard");
           }
         )
        },
      ]);
   
          
      });

//////////////

router.get('/chatlistu/:id',(req,res)=>{
     Consult.find({id:req.params.id},(err,list)=>{
          res.render("chatlistu",{
            list:list
          })
     })
})

router.get('/chatlistd/:id',(req,res)=>{
  Consult.find({assign:req.params.id},(err,list)=>{
       res.render("chatlistd",{
         list:list
       })
  })
})


////

router.get('/chatlistd/reply/:id',(req,res)=>{
  async.waterfall([
    function(callback){
     Consult.find({_id: req.params.id},(err,consult)=>{
         if(err) return next(err);
         callback(null,consult);
     });
    },
    function(consult,callback){
      Chat.find({token:consult[0]._id},(err,token)=>{
          if(err) return next(err);
          callback(null,consult,token);
          console.log(token);
      });
     },
    function(consult,token,callback){ 
      console.log(consult[0]._id);
     User.find({_id:consult[0].assign},(err,user)=>{
         res.render("reply",{

             chat:consult ,
             token:token,
             user:user
         })
           
     });
    },
]);
      
  });
  ///////////

  router.post('/reply',(req,res)=>{
    const{cid,fname,lname,sex,age,speciality,messages,reply,token,response}=req.body;
    console.log(req.body);
    async.waterfall([
      function (callback){
        let message=reply;
        if(response==0){
          ur=1;
          let newchat =new Chat({token,ur,message});
          newchat.save(function(err,room){
            if(err) return next(err);
          callback(null,cid);
         });
        }
        else{
          dr=1;
        let newchat =new Chat({token,dr,message});
        newchat.save(function(err,room){
          if(err) return next(err);
        callback(null,cid);
       });
      }
       
      },
      function(cid,callback){
        Consult.findOne(
          { _id: cid },(err,doc)=>{
            doc.dvisit=1;
             doc.reply=reply;
             doc.save();
             res.redirect("/dashboard");
         }
       )
      },
    ]);
 
        
    });

    router.get('/chatlistu/reply/:id',(req,res)=>{
      async.waterfall([
        function(callback){
         Consult.find({_id: req.params.id},(err,consult)=>{
             if(err) return next(err);
             callback(null,consult);
         });
        },
        function(consult,callback){
          Chat.find({token:consult[0]._id},(err,token)=>{
              if(err) return next(err);
              callback(null,consult,token);
              console.log(token);
          });
         },
        function(consult,token,callback){
          
         User.find({_id:consult[0].id},(err,user)=>{
             res.render("reply",{
                 chat:consult ,
                 token:token,
                 user:user
             })
               
         });
        },
    ]);
      
         
     });



     //corona route
     router.get('/corona',(req,res)=>{
      res.render('corona');
      });
//>----------------end here-----------------------------<

 module.exports=router;