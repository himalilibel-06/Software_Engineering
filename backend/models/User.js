import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  profileImage: { type: String, default: "" }, // Added field for image persistence
  phone: { type: String, default: "" },
  employeeId: { type: String, default: "" },
  department: { type: String, default: "" },
  officeLocation: { type: String, default: "" },
  company: { type: String, default: "" },
  dateJoined: { type: String, default: "" },
  officePhone: { type: String, default: "" },
  emergencyContact: { type: String, default: "" },
  jobTitle: { type: String, default: "" },
  experience: { type: String, default: "" },
  specialization: { type: String, default: "" },
  skills: [String],
  stats: Array,
  recentActivity: Array
}, { timestamps: true });

// Hash the password before saving
// INCORRECT
// Hash the password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;