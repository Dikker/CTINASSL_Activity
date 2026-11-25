const mongoose = require ("mongoose");
 
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/INF245MWA")
        console.log("MongoDB Connected Successfully.");
    } catch (error) {
        console.error("Error Connecting to MongoDB: ", error);
    }
};
 
module.exports = connectDB;