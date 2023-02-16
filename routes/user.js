const express = require('express');
var router = require('express').Router();
var User= require('../models/user');
var bcrypt=require('bcrypt');
var passport=require('passport');


router.get('/signup',(req,res)=>{
  res.render('signup');
  });
 
  router.get('/signin',(req,res)=>{
   res.render('signin');
   });

   router.post('/signup',(req,res)=>{
    
     const{name,email,phone,typo,password}=req.body;
     let errors =[];
       if(!name||!email||!phone||!typo||!password){
         errors.push({msg:'please fill in all fields!!!'});
       }
       if(password.length<6){
        errors.push({msg:'password should be at least 6 characters long!!!'});
       }
       if(errors.length>0){
             res.render('signup',{
               errors,name,email,phone,typo,password
              });
       }
       else{
          User.findOne({email:email})
          .then(user=>{
            if(user){
              errors.push({msg:'email already exist!!!'});
              res.render('signup',{
                errors,name,email,phone,typo,password
               });
            }
            else{
              let newuser =new User({
                name,
                email,
                phone,
                typo,
                password
               });
               //Hash password
               bcrypt.genSalt(10,(err,salt)=>
               bcrypt.hash(newuser.password,salt,(err,hash)=>{
                 if(err) throw err;
                 newuser.password=hash;
                 newuser.save()
                 .then(user =>{
                   res.redirect('/user/signin');
                 })
                 .catch(err =>console.log(err));
               }))
               
              
             }
          });
        }
      });

         
 router.post('/signin',(req,res,next)=>{
  passport.authenticate('local', 
  { successRedirect: '/dashboard',
  failureRedirect: '/user/signin',
  failureFlash: true })(req,res,next);
 });

 router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/user/signin');
});


 module.exports=router;