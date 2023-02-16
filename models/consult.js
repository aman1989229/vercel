const mongoose = require('mongoose');

var Schema= mongoose.Schema;

const ConsultSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true
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
 
  speciality: {
    type: String,
    required:true
  },
 
  message: {
    type: String,
    required:true
  },
  assign:{
      type: String,
      default:0
  },
  reply:{
      type:String
  },
  dvisit:{
   type:Number,
   default:0
  },
  uvisit:{
    type:Number,
    default:0
  },
  date:{
    type:Date,
    default:Date.now
  }
});


const Consult = module.exports = mongoose.model('consults', ConsultSchema);