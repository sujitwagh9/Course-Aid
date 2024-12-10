import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',  // Reference to the Category model
    required: true,   // Each course must belong to a category
  },
  tags: {
    type: [String],
    default: [],
  },
  instructorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [{
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }, 
    rating: Number, 
    comment: String, 
    createdAt: Date,
  }],
  enrolledLearners: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  content: [{
    type: Schema.Types.ObjectId,
    ref: 'CourseContent',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Course= mongoose.model('Course', courseSchema);

export{Course}
