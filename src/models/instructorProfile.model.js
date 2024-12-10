import mongoose, { Schema } from "mongoose";

const instructorProfileSchema = new Schema({
  instructorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  certifications: [{
    type: String
  }],
  bio: {
    type: String,
    required: false
  },
  profilePicture: {
    type: String, 
    required: false
  }
});

const InstructorProfile= mongoose.model('InstructorProfile', instructorProfileSchema);

export{InstructorProfile}
