import mongoose from 'mongoose';

// This is the blueprint for a single BIM Asset
const assetSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., HVAC, Electrical, Plumbing
  status: { type: String, required: true, default: 'Active' }, // e.g., Active, Under Maintenance
  location: { type: String }, // e.g., Floor 3, Room 302
  installationDate: { type: String },
  manufacturer: { type: String },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  health: { type: Number, default: 100 },
  lastMaintenance: { type: String }
}, { 
  timestamps: true // This automatically adds "createdAt" and "updatedAt" timestamps for us!
});



// Create the model based on the blueprint
const Asset = mongoose.model('Asset', assetSchema);

export default Asset;