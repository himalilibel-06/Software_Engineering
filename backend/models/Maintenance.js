import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  assetId: { type: String, required: true },
  taskName: { type: String, required: true },
  category: { type: String, default: "Preventive" },
  priority: { type: String, default: "Medium" },
  frequency: { type: String, default: "Routine" },
  scheduledDate: { type: Date, required: true },
  assignedTeam: { type: String, default: "Unassigned" },
  workStatus: { type: String, default: "Scheduled" },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model('Maintenance', maintenanceSchema);