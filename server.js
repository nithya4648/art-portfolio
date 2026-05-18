require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for Base64 images

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scornith_art')
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// Order Schema
const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    deliveryDate: { type: String, required: true },
    size: { type: String, required: true },
    photo: { type: String, required: true }, // Base64 string
    message: String,
    notes: { type: String, default: '' },
    status: { type: String, default: 'Pending', enum: ['Pending', 'In Progress', 'Completed'] },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// API Routes

// Create Order
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get All Orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Order Details
app.patch('/api/orders/:id', async (req, res) => {
    try {
        console.log(`📡 Update request for ID: ${req.params.id}`, req.body);
        
        // Use $set to explicitly update fields provided in req.body
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            console.log('❌ Order not found');
            return res.status(404).json({ error: 'Order not found' });
        }

        console.log('✅ Order saved. Notes content:', updatedOrder.notes);
        res.json(updatedOrder);
    } catch (err) {
        console.error('❌ Update error:', err.message);
        res.status(400).json({ error: err.message });
    }
});

// Delete Order
app.delete('/api/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/", (req, res) => {
    res.send("Backend Running 🚀");
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
