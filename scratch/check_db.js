require('dotenv').config();
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: String,
    notes: String,
    status: String
});

const Order = mongoose.model('Order', orderSchema);

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        const orders = await Order.find();
        console.log(`📊 Found ${orders.length} orders.`);
        
        orders.forEach(o => {
            console.log(`- Order: ${o.name} | Notes: "${o.notes}" | Status: ${o.status}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

checkDB();
