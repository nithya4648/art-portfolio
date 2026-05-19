require('dotenv').config();
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    notes: { type: String, default: '' }
}, { strict: false });

const Order = mongoose.model('Order', orderSchema);

async function deepCleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        // Find all orders
        const orders = await Order.find();
        let fixedCount = 0;

        for (const order of orders) {
            // If notes is literal undefined, null, or the string "undefined"
            if (order.notes === undefined || order.notes === null || order.notes === "undefined") {
                order.notes = "";
                await order.save();
                fixedCount++;
            }
        }
        
        console.log(`🧹 Deep cleaned ${fixedCount} orders.`);
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

deepCleanup();
