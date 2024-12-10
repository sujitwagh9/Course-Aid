import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,  
    trim: true,    
  },
  description: {
    type: String,
    required: true,
    trim: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now,  
  },
  updatedAt: {
    type: Date,
    default: Date.now,  
  },
}, { timestamps: true });


const Category =mongoose.model('Category', categorySchema);
export{Category}