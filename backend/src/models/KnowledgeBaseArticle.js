const mongoose=require("mongoose");
const schema=new mongoose.Schema({
  title:{type:String,required:true,trim:true,maxlength:200},
  content:{type:String,required:true,trim:true,maxlength:50000},
  category:{type:mongoose.Schema.Types.ObjectId,ref:"Category",default:null,index:true},
  tags:{type:[String],default:[]},isPublished:{type:Boolean,default:true,index:true},
  createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
},{timestamps:true});
schema.index({title:"text",content:"text",tags:"text"});
module.exports=mongoose.model("KnowledgeBaseArticle",schema);
