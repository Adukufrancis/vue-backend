const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let db;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/lessondb';

async function connectToDatabase() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db('lessondb');
        console.log('Connected to MongoDB Atlas');
        
        // Initialize collections with sample data if they don't exist
        await initializeCollections();
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

async function initializeCollections() {
    try {
        // Check if lessons collection exists and has data
        const lessonsCount = await db.collection('lessons').countDocuments();
        if (lessonsCount === 0) {
            const sampleLessons = [
                {
                    subject: 'Mathematics',
                    location: 'London',
                    price: 25,
                    availability: 5,
                    createdAt: new Date()
                },
                {
                    subject: 'English',
                    location: 'Manchester',
                    price: 20,
                    availability: 5,
                    createdAt: new Date()
                },
                {
                    subject: 'Science',
                    location: 'Birmingham',
                    price: 30,
                    availability: 8,
                    createdAt: new Date()
                },
                {
                    subject: 'History',
                    location: 'Liverpool',
                    price: 22,
                    availability: 5,
                    createdAt: new Date()
                },
                {
                    subject: 'Geography',
                    location: 'Leeds',
                    price: 18,
                    availability: 6,
                    createdAt: new Date()
                },
                {
                    subject: 'Art',
                    location: 'Bristol',
                    price: 28,
                    availability: 5,
                    createdAt: new Date()
                },
                {
                    subject: 'Music',
                    location: 'Edinburgh',
                    price: 35,
                    availability: 5,
                    createdAt: new Date()
                },
                {
                    subject: 'Physics',
                    location: 'Glasgow',
                    price: 32,
                    availability: 7,
                    createdAt: new Date()
                },
                {
                    subject: 'Chemistry',
                    location: 'Cardiff',
                    price: 29,
                    availability: 5,
                    createdAt: new Date()
                },
                {
                    subject: 'Biology',
                    location: 'Belfast',
                    price: 27,
                    availability: 5,
                    createdAt: new Date()
                }
            ];
            
            await db.collection('lessons').insertMany(sampleLessons);
            console.log('Sample lessons inserted');
        }
    } catch (error) {
        console.error('Error initializing collections:', error);
    }
}

// Routes

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Lesson Management API',
        version: '1.0.0',
        endpoints: {
            lessons: '/api/lessons',
            orders: '/api/orders'
        }
    });
});

// Get all lessons
app.get('/api/lessons', async (req, res) => {
    try {
        const lessons = await db.collection('lessons').find({}).toArray();
        res.json(lessons);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).json({ error: 'Failed to fetch lessons' });
    }
});

// Get a specific lesson
app.get('/api/lessons/:id', async (req, res) => {
    try {
        const lesson = await db.collection('lessons').findOne({ _id: new ObjectId(req.params.id) });
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        res.json(lesson);
    } catch (error) {
        console.error('Error fetching lesson:', error);
        res.status(500).json({ error: 'Failed to fetch lesson' });
    }
});

// Create a new lesson
app.post('/api/lessons', async (req, res) => {
    try {
        const { subject, location, price, availability } = req.body;
        
        if (!subject || !location || price === undefined || availability === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const newLesson = {
            subject,
            location,
            price: parseFloat(price),
            availability: parseInt(availability),
            createdAt: new Date()
        };
        
        const result = await db.collection('lessons').insertOne(newLesson);
        const lesson = await db.collection('lessons').findOne({ _id: result.insertedId });
        
        res.status(201).json(lesson);
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ error: 'Failed to create lesson' });
    }
});

// Update lesson availability
app.put('/api/lessons/:id/availability', async (req, res) => {
    try {
        const { change } = req.body;
        
        if (change === undefined) {
            return res.status(400).json({ error: 'Change value is required' });
        }
        
        const lesson = await db.collection('lessons').findOne({ _id: new ObjectId(req.params.id) });
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        
        const newAvailability = Math.max(0, lesson.availability + parseInt(change));
        
        await db.collection('lessons').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { availability: newAvailability } }
        );
        
        const updatedLesson = await db.collection('lessons').findOne({ _id: new ObjectId(req.params.id) });
        res.json(updatedLesson);
    } catch (error) {
        console.error('Error updating lesson availability:', error);
        res.status(500).json({ error: 'Failed to update lesson availability' });
    }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Create a new order
app.post('/api/orders', async (req, res) => {
    try {
        const { name, phone, lessons, total } = req.body;
        
        if (!name || !phone || !lessons || !Array.isArray(lessons) || lessons.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const newOrder = {
            name,
            phone,
            lessons,
            total: parseFloat(total),
            createdAt: new Date()
        };
        
        const result = await db.collection('orders').insertOne(newOrder);
        const order = await db.collection('orders').findOne({ _id: result.insertedId });
        
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get a specific order
app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await db.collection('orders').findOne({ _id: new ObjectId(req.params.id) });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Search lessons
app.get('/api/lessons/search/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const lessons = await db.collection('lessons').find({
            $or: [
                { subject: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } }
            ]
        }).toArray();
        res.json(lessons);
    } catch (error) {
        console.error('Error searching lessons:', error);
        res.status(500).json({ error: 'Failed to search lessons' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
