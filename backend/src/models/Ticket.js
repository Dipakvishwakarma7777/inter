const mongoose = require("mongoose");
const ticketSchema = new mongoose.Schema({
  title:{type:String,required:true,trim:true,maxlength:200},
  description:{type:String,required:true,trim:true,maxlength:20000},
  status:{type:String,enum:["open","in-progress","resolved","closed"],default:"open",index:true},
  priority:{type:String,enum:["low","medium","high","urgent"],default:"medium",index:true},
  category:{type:mongoose.Schema.Types.ObjectId,ref:"Category",index:true,default:null},
  createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},
  assignedTo:{type:mongoose.Schema.Types.ObjectId,ref:"User",default:null,index:true},
  closedAt:{type:Date,default:null}, resolvedAt:{type:Date,default:null},
  firstResponseAt:{type:Date,default:null}, slaDueAt:{type:Date,default:null,index:true},
  slaBreached:{type:Boolean,default:false,index:true}
},{timestamps:true});
ticketSchema.index({title:"text",description:"text"});
ticketSchema.index({createdBy:1,createdAt:-1});
ticketSchema.index({assignedTo:1,status:1,createdAt:-1});
module.exports=mongoose.model("Ticket",ticketSchema);
