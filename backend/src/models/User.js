const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name:{type:String,required:true,trim:true,minlength:2,maxlength:100},
  email:{type:String,required:true,unique:true,lowercase:true,trim:true,index:true},
  password:{type:String,required:true,minlength:8,select:false},
  role:{type:String,enum:["user","agent","admin"],default:"user",index:true},
  profileImage:{type:String,default:""},phone:{type:String,default:""},
  isActive:{type:Boolean,default:true,index:true},
  resetPasswordTokenHash:{type:String,select:false,default:null},
  resetPasswordExpiresAt:{type:Date,select:false,default:null}
},{timestamps:true});
userSchema.set("toJSON",{transform:(_,ret)=>{delete ret.password;delete ret.resetPasswordTokenHash;delete ret.resetPasswordExpiresAt;delete ret.__v;return ret;}});
module.exports=mongoose.model("User",userSchema);
