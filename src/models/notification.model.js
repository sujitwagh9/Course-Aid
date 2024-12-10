import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['session_update', 'course_update', 'payment_update', 'reminder', 'other'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  relatedEntity: {
    type: Schema.Types.ObjectId,
    refPath: 'type',
  },
  readStatus: {
    type: Boolean,
    default: false,
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

const Notification= mongoose.model('Notification', notificationSchema);

export {Notification}
