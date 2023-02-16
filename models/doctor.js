const mongoose = require('mongoose');

var Schema= mongoose.Schema;

const DoctorSchema = new mongoose.Schema({
  did:{
   type:String,
   require:true
  },
  fname: {
    type: String,
    required:true
  },  
  lname: {
    type: String,
    required:true
  },
  sex: {
    type: String,
    required:true
  },
  age: {
    type: Number,
    required:true
  },
  category: {
    type: String,
    required:true
  },
  speciality: {
    type: String,
    required:true
  },
  experience:{
    type: Number,
    required:true
  },
  address: {
    type: String,
    required:true
  },
  date:{
    type:Date,
    default:Date.now
  }
});


const Doctor = module.exports = mongoose.model('doctors', DoctorSchema);