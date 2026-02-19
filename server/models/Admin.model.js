import mongoose from "mongoose";

const adminShema = new mongoose.Schema({ 
    username: {
      type: String,
      required:true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password:{
        type:String,
        required:true,
    },
    role: {
      type: String,
      default: "admin",
    },
},{ timestamps:true });

const Admin = mongoose.model("Admin", adminShema);
export default Admin;

