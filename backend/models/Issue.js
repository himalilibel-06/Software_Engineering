import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema({
  // ── USER SCOPING ──────────────────────────────────────────────────────────
  // Ties this specific issue to the logged-in user
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // ── ISSUE DETAILS ─────────────────────────────────────────────────────────
  title: { type: String, required: true },
  assetId: { type: String, required: true }, // Ties directly to your asset configuration
  category: { 
    type: String, 
    required: true, 
    enum: ['Plumbing', 'HVAC', 'Electrical', 'Mechanical', 'Safety'] 
  },
  priority: { 
    type: String, 
    required: true, 
    enum: ['High', 'Medium', 'Low'], 
    default: 'Medium' 
  },
  reportedBy: { type: String, required: true },
  assignedTo: { type: String, default: 'Unassigned' },
  status: { 
    type: String, 
    required: true, 
    enum: ['Open', 'In Progress', 'Resolved'], 
    default: 'Open' 
  }
}, { 
  timestamps: true // Gives createdAt (Date Reported) and updatedAt automatically
});

export default mongoose.model('Issue', IssueSchema);