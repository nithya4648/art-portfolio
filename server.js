require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('✅ Connected to MongoDB');
})
.catch((err) => {
    console.log('❌ MongoDB Connection Error:', err);
});

// Order Schema
const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    contact: {
        type: String,
        required: true
    },

    deliveryDate: {
        type: String,
        required: true
    },

    size: {
        type: String,
        required: true
    },

    photo: {
        type: String,
        required: true
    },

    message: {
        type: String
    },

    notes: {
        type: String,
        default: ''
    },

    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'In Progress', 'Completed']
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

// =======================
// CREATE ORDER
// =======================
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order Created Successfully',
            data: newOrder
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

// =======================
// GET ALL ORDERS
// =======================
app.get('/api/orders', async (req, res) => {
    try {

        const orders = await Order.find()
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: orders
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// =======================
// UPDATE ORDER
// =======================
app.patch('/api/orders/:id', async (req, res) => {
    try {

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order Updated Successfully',
            data: updatedOrder
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

// =======================
// DELETE ORDER
// =======================
app.delete('/api/orders/:id', async (req, res) => {
    try {

        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order Deleted Successfully'
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});// =======================
// ADMIN LOGIN
// =======================
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
    ) {
        return res.json({
            success: true
        });
    }

    return res.status(401).json({
        success: false,
        message: "Invalid credentials"
    });
});

// =======================
// SERVER START
// =======================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
