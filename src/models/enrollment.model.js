import mongoose, { Schema } from "mongoose";

const enrollmentSchema = new Schema({
  learnerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped'],
    default: 'active'
  },
  progress: {
    type: Number, // 0-100%
    default: 0
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  }
});

const Enrollment= mongoose.model('Enrollment', enrollmentSchema);

export {Enrollment}
