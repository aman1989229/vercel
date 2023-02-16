const mongoose = require('mongoose');

var Schema= mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required:true
  },
  phone:{
    type: Number,
    required:true
  },
  typo:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  prime:{
    type:Number,
    default:0
  },
  date:{
    type:Date,
    default:Date.now
  }
});


const User = module.exports = mongoose.model('user', UserSchema);