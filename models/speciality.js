const mongoose = require('mongoose');

var Schema= mongoose.Schema;

const Speciality= new mongoose.Schema({
  speciality: {
    type: String,
    required:true
  },
 
  date:{
    type:Date,
    default:Date.now
  }
});


const Special = module.exports = mongoose.model('speciality',Speciality);