import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema({
  courseContentId: {
    type: Schema.Types.ObjectId,
    ref: 'CourseContent',
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true/false', 'short-answer'],
    required: true,
  },
  options: [{
    type: String,
  }],
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
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


const Question= mongoose.model('Question', questionSchema);
export{Question}
