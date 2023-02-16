const mongoose = require('mongoose');

var Schema= mongoose.Schema;

const ChatSchema = new mongoose.Schema({
    
  token: {
    type: String,
    required:true
  },  
  id: {
    type: String,
    default:0
  },
  did: {
    type: String,
    default:0
  },
  ur: {
    type:Number,
   default:0
  },
  dr: {
    type:Number,
   default:0
  },
  close: {
    type:Number,
   default:0
  },
  message: {
    type: String,
    required:true
  },
});


const Chat = module.exports = mongoose.model('chats', ChatSchema);