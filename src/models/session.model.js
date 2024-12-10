import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema({
  learnerId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  instructorId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  sessionDateTime: {
    type: Date,
    required: true,
  },
  sessionStatus: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'canceled'],
    default: 'scheduled',
  },
  duration: {
    type: Number, 
  },
  sessionNotes: {
    type: String,
  },
  sessionPlatformLink: {
    type: String,
    required:true,
  },
  learnerFeedback: {
    type: String, // Optional: feedback from the learner after the session
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'free'], // Whether the session is paid or free
    default: 'paid',
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

const Session= mongoose.model('Session', sessionSchema);

export {Session}
