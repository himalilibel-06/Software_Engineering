import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Import Middleware
import { verifyToken } from './middleware/auth.js';

// Import Models
import User from './models/User.js';
import Asset from './models/Asset.js'; 
import Issue from './models/Issue.js';
import Maintenance from './models/Maintenance.js'; 
import Technician from './models/Technician.js';
import authRoutes from './routes/authRoutes.js';
// Change this line in index.js:


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support base64 profile pictures and regular JSON payloads

// 2. Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB successfully!");
    } catch (err) {
        console.error("Could not connect to MongoDB:", err);
    }
};
connectDB();

// 3. Routes
app.use('/api/auth', authRoutes);

// ── Asset Channels (User-Scoped) ──────────────────────────────────────────────
app.get('/api/assets', verifyToken, async (req, res) => {
    try { 
        // Fetch only assets belonging to the logged-in user
        const assets = await Asset.find({ userId: req.user.id }).sort({ createdAt: -1 }); 
        res.json(assets); 
    }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/assets', verifyToken, async (req, res) => {
    try { 
        // Attach userId to the newly created asset
        const newAsset = new Asset({ ...req.body, userId: req.user.id }); 
        await newAsset.save(); 
        res.status(201).json(newAsset); 
    }
    catch (err) { res.status(400).json({ error: err.message }); }
});

// ── Issue Channels (User-Scoped) ──────────────────────────────────────────────
app.get('/api/issues', verifyToken, async (req, res) => {
    try { 
        // Fetch only issues belonging to the logged-in user
        const issues = await Issue.find({ userId: req.user.id }).sort({ createdAt: -1 }); 
        res.json(issues); 
    }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/issues', verifyToken, async (req, res) => {
    try { 
        // Attach userId to the newly created issue
        const newIssue = new Issue({ ...req.body, userId: req.user.id }); 
        await newIssue.save(); 
        res.status(201).json(newIssue); 
    }
    catch (err) { res.status(400).json({ error: err.message }); }
});

// ── Technician Channels ───────────────────────────────────────────────────────
app.get('/api/technicians', verifyToken, async (req, res) => {
    try { 
        const techs = await Technician.find(); 
        res.json(techs); 
    }
    catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Maintenance Channels (User-Scoped) ─────────────────────────────────────────
app.get('/api/maintenance', verifyToken, async (req, res) => {
    try { 
        // Fetch only maintenance logs belonging to the logged-in user
        const schedules = await Maintenance.find({ userId: req.user.id }).sort({ scheduledDate: 1 }); 
        res.json(schedules); 
    }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/maintenance', verifyToken, async (req, res) => {
    try { 
        const maintenanceData = { ...req.body };
        // Map frontend fields to backend schema
        if (req.body.dueDate) {
            maintenanceData.scheduledDate = new Date(req.body.dueDate);
        }
        if (req.body.technician) {
            maintenanceData.assignedTeam = req.body.technician;
        }
        if (req.body.status) {
            maintenanceData.workStatus = req.body.status;
        }
        
        // Ensure scheduledDate has a value if missing
        if (!maintenanceData.scheduledDate) {
            maintenanceData.scheduledDate = new Date();
        }

        const newMaint = new Maintenance({ ...maintenanceData, userId: req.user.id }); 
        await newMaint.save(); 
        res.status(201).json(newMaint); 
    }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/dashboard/stats', verifyToken, async (req, res) => {
    try {
        const totalAssets = await Asset.countDocuments({ userId: req.user.id });
        const activeIssuesCount = await Issue.countDocuments({ userId: req.user.id, status: { $ne: "Resolved" } });
        
        // Count active issues by category for breakdown stats
        const activeIssuesList = await Issue.find({ userId: req.user.id, status: { $ne: "Resolved" } });
        const breakdown = {};
        activeIssuesList.forEach(issue => {
            const cat = issue.category || "Uncategorized";
            breakdown[cat] = (breakdown[cat] || 0) + 1;
        });

        // Maintenance tasks scheduled for today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const maintenanceToday = await Maintenance.countDocuments({
            userId: req.user.id,
            scheduledDate: { $gte: startOfDay, $lte: endOfDay }
        });

        res.json({ 
            totalAssets, 
            activeIssuesCount, 
            activeIssues: activeIssuesCount, // compat
            maintenanceToday, 
            breakdown 
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── User Profile Channels ─────────────────────────────────────────────────────
app.get('/api/users/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/users/:id', verifyToken, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Additional Extended Channels ─────────────────────────────────────────────

// GET all users (User Directory)
app.get('/api/users', verifyToken, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create user (Admin Panel)
app.post('/api/users', verifyToken, async (req, res) => {
    try {
        const userData = { ...req.body };
        if (!userData.password) {
            userData.password = "Welcome@123"; // default pwd
        }
        const newUser = new User(userData);
        await newUser.save();
        
        const userObj = newUser.toObject();
        delete userObj.password;
        res.status(201).json(userObj);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE delete user
app.delete('/api/users/:id', verifyToken, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update asset
app.put('/api/assets/:id', verifyToken, async (req, res) => {
    try {
        const query = mongoose.isValidObjectId(req.params.id)
            ? { _id: req.params.id, userId: req.user.id }
            : { assetId: req.params.id, userId: req.user.id };
        const updatedAsset = await Asset.findOneAndUpdate(
            query,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedAsset) {
            return res.status(404).json({ error: "Asset not found" });
        }
        res.json(updatedAsset);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE delete asset
app.delete('/api/assets/:id', verifyToken, async (req, res) => {
    try {
        const query = mongoose.isValidObjectId(req.params.id)
            ? { _id: req.params.id, userId: req.user.id }
            : { assetId: req.params.id, userId: req.user.id };
        const deletedAsset = await Asset.findOneAndDelete(query);
        if (!deletedAsset) {
            return res.status(404).json({ error: "Asset not found" });
        }
        res.json({ message: "Asset deleted successfully", deletedAsset });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update issue status
app.put('/api/issues/:id/status', verifyToken, async (req, res) => {
    try {
        const updatedIssue = await Issue.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { $set: { status: req.body.status } },
            { new: true }
        );
        if (!updatedIssue) {
            return res.status(404).json({ error: "Issue not found" });
        }
        res.json(updatedIssue);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT assign staff to issue
app.put('/api/issues/:id/assign', verifyToken, async (req, res) => {
    try {
        const updatedIssue = await Issue.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { $set: { assignedTo: req.body.assignedTo } },
            { new: true }
        );
        if (!updatedIssue) {
            return res.status(404).json({ error: "Issue not found" });
        }
        res.json(updatedIssue);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE delete issue
app.delete('/api/issues/:id', verifyToken, async (req, res) => {
    try {
        const deletedIssue = await Issue.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deletedIssue) {
            return res.status(404).json({ error: "Issue not found" });
        }
        res.json({ message: "Issue deleted successfully", deletedIssue });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update maintenance task
app.put('/api/maintenance/:id', verifyToken, async (req, res) => {
    try {
        const query = mongoose.isValidObjectId(req.params.id)
            ? { _id: req.params.id, userId: req.user.id }
            : { assetId: req.params.id, userId: req.user.id };
            
        const updateData = { ...req.body };
        if (req.body.dueDate) {
            updateData.scheduledDate = new Date(req.body.dueDate);
        }
        if (req.body.technician) {
            updateData.assignedTeam = req.body.technician;
        }
        if (req.body.status) {
            updateData.workStatus = req.body.status;
        }
        
        const updatedMaint = await Maintenance.findOneAndUpdate(
            query,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!updatedMaint) {
            return res.status(404).json({ error: "Maintenance log not found" });
        }
        res.json(updatedMaint);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE delete maintenance task
app.delete('/api/maintenance/:id', verifyToken, async (req, res) => {
    try {
        const query = mongoose.isValidObjectId(req.params.id)
            ? { _id: req.params.id, userId: req.user.id }
            : { assetId: req.params.id, userId: req.user.id };
        const deletedMaint = await Maintenance.findOneAndDelete(query);
        if (!deletedMaint) {
            return res.status(404).json({ error: "Maintenance log not found" });
        }
        res.json({ message: "Maintenance log deleted successfully", deletedMaint });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET BIM models static simulation data
app.get('/api/bim', verifyToken, async (req, res) => {
    res.json({
        categories: [
            { id: "hvac", label: "HVAC Systems", iconKey: "hvac", count: 3, color: "text-sky-500" },
            { id: "electrical", label: "Electrical Systems", iconKey: "electrical", count: 2, color: "text-amber-500" },
            { id: "plumbing", label: "Plumbing Loop", iconKey: "plumbing", count: 1, color: "text-blue-500" },
            { id: "safety", label: "Fire & Safety", iconKey: "fire", count: 1, color: "text-rose-500" }
        ],
        assets: [
            { id: "AHU-04", name: "Air Handling Unit 4", category: "hvac", status: "operational", health: 92, iconKey: "hvac" },
            { id: "CH-01", name: "Water Chiller Plant 1", category: "hvac", status: "operational", health: 87, iconKey: "hvac" },
            { id: "VAV-04-12", name: "VAV Box Floor 4-12", category: "hvac", status: "warning", health: 64, iconKey: "hvac" },
            { id: "DB-MAIN", name: "Main Distribution Board", category: "electrical", status: "operational", health: 98, iconKey: "electrical" },
            { id: "GEN-02", name: "Backup Generator 2", category: "electrical", status: "maintenance", health: 45, iconKey: "electrical" },
            { id: "PUMP-CHW", name: "Chilled Water Pump", category: "plumbing", status: "operational", health: 90, iconKey: "plumbing" },
            { id: "FS-PANEL", name: "Main Fire Alarm Panel", category: "safety", status: "operational", health: 100, iconKey: "fire" }
        ],
        maintenanceHistory: [
            { date: "2026-07-15", task: "Coil Cleaning", technician: "A. Kumar", status: "Completed" },
            { date: "2026-06-10", task: "Belt Replacement", technician: "R. Sharma", status: "Completed" },
            { date: "2026-05-01", task: "Sensor Calibration", technician: "S. Patel", status: "Completed" }
        ],
        openIssues: [
            { id: "ISS-102", title: "VAV damper stuck 40%", priority: "medium", status: "In Progress", reported: "2026-07-28", description: "Damper actuator unresponsive to control loop overrides." },
            { id: "ISS-105", title: "Gen-02 cooling fan noise", priority: "low", status: "Open", reported: "2026-07-30", description: "Bearing vibration detected during weekly routine tests." }
        ],
        documents: [
            { name: "AHU-04 Operation Manual", type: "PDF", size: "4.8 MB" },
            { name: "BIM Coordination Guidelines", type: "PDF", size: "12.3 MB" },
            { name: "Single Line Diagram (Electrical)", type: "DWG", size: "2.1 MB" }
        ],
        activities: [
            { event: "Chiller Sync", description: "Chiller Plant telemetry successfully verified", time: "10 mins ago", iconKey: "check", colorClass: "text-emerald-500 bg-emerald-50" },
            { event: "Task Scheduled", description: "Routine inspection assigned to R. Sharma", time: "2 hrs ago", iconKey: "tool", colorClass: "text-blue-500 bg-blue-50" },
            { event: "Alert Logged", description: "Gen-02 state flagged as Maintenance required", time: "5 hrs ago", iconKey: "alert", colorClass: "text-red-500 bg-red-50" }
        ],
        modelDetails: [
            { label: "LOD", value: "LOD 400" },
            { label: "File Format", value: "Revit (.rvt)" },
            { label: "Last Synced", value: "2026-08-01" },
            { label: "Mesh Nodes", value: "1,248,390" }
        ],
        quickStats: [
            { label: "Model Quality", value: "Excellent" },
            { label: "Active Nodes", value: "7/7 Online" }
        ]
    });
});

// 4. Server Start Root & Listener
app.get('/', (req, res) => res.send('BIM Backend is live!'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});