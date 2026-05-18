require('dotenv').config();
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: String,
    notes: { type: String, default: '' },
    status: String
});

const Order = mongoose.model('Order', orderSchema);

async function cleanupDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scornith_art');
        console.log('✅ Connected to MongoDB');
        
        // Update all orders where notes is the string "undefined" to be empty string
        const result = await Order.updateMany(
            { notes: "undefined" }, 
            { $set: { notes: "" } }
        );
        
        console.log(`🧹 Cleaned up ${result.modifiedCount} orders.`);

        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

cleanupDB();
