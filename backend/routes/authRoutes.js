import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getJwtSecret } from '../lib/jwtSecret.js';

const router = express.Router();

// Route to handle Signups
router.post('/signup', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save(); 
    
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    // TEMP DEBUG LOG - remove after diagnosing "next is not a function" issue
    console.log("=== SIGNUP ERROR DEBUG ===");
    console.log("Message:", error.message);
    console.log("Stack:", error.stack);
    console.log("==========================");

    console.log("Mongoose Validation Error:", error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: "This email is already registered." });
    }
    
    res.status(400).json({ message: "Error saving user", error: error.message });
  }
});

// Login Handler Function to reuse for case sensitivity
const handleLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // 1. Find the user in the database
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "User not found. Please sign up." });
    }

    // 2. Password check using bcrypt compare
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // 3. ROLE CHECK
    if (role && user.role !== role) {
      return res.status(403).json({ 
        message: `Access denied!` 
      });
    }

    // --- 4. GENERATE JWT TOKEN ---
    // We store both user._id and userId for backend compatibility
    const token = jwt.sign(
      { id: user._id, userId: user._id, role: user.role },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    // 5. Login successful - Return token and user profile data
    res.status(200).json({
      message: "Login successful!",
      token: token, // <-- Sending the token to the frontend!
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Handle both route patterns so case sensitivity won't break it
router.post('/login', handleLogin);
router.post('/Login', handleLogin);

export default router;