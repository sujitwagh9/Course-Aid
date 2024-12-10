import mongoose, { Schema } from "mongoose";

const courseContentSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['video', 'quiz', 'document'],
    required: true,
  },
  videoUrl: {
    type: String,
    required: function() { return this.type === 'video'; },
  },
  thumbnailUrl: {
    type: String,
    required: function() { return this.type === 'video'; },
  },
  duration: {
    type: Number,
    required: function() { return this.type === 'video'; },
  },
  description: {
    type: String,
    default: '',
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question', 
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


const CourseContent= mongoose.model('CourseContent', courseContentSchema);

export{CourseContent}
