import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;

console.log(uri); // Optional: check if it prints your URI

mongoose.connect(uri)
  .then(() => {
    console.log("Successfully connected!");
    process.exit();
  })
  .catch(err => {
    console.error("Failed:", err);
    process.exit(1);
  });