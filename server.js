const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Basic Middleware
app.use(cors());
app.use(express.json());

// Logger Middleware (4% Backend Requirement)
// This middleware logs all incoming requests to the server console
const logger = (req, res, next) => {
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Get client IP address (handles proxy scenarios)
    const clientIP = req.ip || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress ||
                    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                    req.headers['x-forwarded-for'] ||
                    'unknown';
    
    // Get user agent
    const userAgent = req.get('User-Agent') || 'unknown';
    
    // Get request size (content-length)
    const contentLength = req.get('Content-Length') || '0';
    
    // Log the incoming request
    console.log('\n' + '='.repeat(80));
    console.log(`📥 INCOMING REQUEST`);
    console.log('='.repeat(80));
    console.log(`🕐 Timestamp:     ${timestamp}`);
    console.log(`🌐 Method:        ${req.method}`);
    console.log(`📍 URL:           ${req.originalUrl || req.url}`);
    console.log(`🔗 Full URL:      ${req.protocol}://${req.get('host')}${req.originalUrl || req.url}`);
    console.log(`💻 Client IP:     ${clientIP}`);
    console.log(`📱 User Agent:    ${userAgent}`);
    console.log(`📊 Content-Length: ${contentLength} bytes`);
    
    // Log headers (excluding sensitive ones)
    console.log(`📋 Headers:`);
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    Object.keys(req.headers).forEach(header => {
        if (!sensitiveHeaders.includes(header.toLowerCase())) {
            console.log(`   ${header}: ${req.headers[header]}`);
        } else {
            console.log(`   ${header}: [HIDDEN FOR SECURITY]`);
        }
    });
    
    // Log query parameters if present
    if (Object.keys(req.query).length > 0) {
        console.log(`🔍 Query Params:  ${JSON.stringify(req.query)}`);
    }
    
    // Log request body for POST/PUT/PATCH requests (limit size for readability)
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        const bodyStr = JSON.stringify(req.body, null, 2);
        if (bodyStr.length > 500) {
            console.log(`📝 Request Body:  ${bodyStr.substring(0, 500)}... [TRUNCATED]`);
        } else {
            console.log(`📝 Request Body:  ${bodyStr}`);
        }
    }
    
    // Track response time
    const startTime = Date.now();
    
    // Override res.end to log response details
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
        // Calculate response time
        const responseTime = Date.now() - startTime;
        
        // Log the response
        console.log('\n' + '-'.repeat(80));
        console.log(`📤 OUTGOING RESPONSE`);
        console.log('-'.repeat(80));
        console.log(`🕐 Response Time:  ${responseTime}ms`);
        console.log(`📊 Status Code:    ${res.statusCode} ${getStatusMessage(res.statusCode)}`);
        console.log(`📋 Response Headers:`);
        Object.keys(res.getHeaders()).forEach(header => {
            console.log(`   ${header}: ${res.getHeaders()[header]}`);
        });
        
        // Log response size if available
        const responseSize = res.get('Content-Length') || (chunk ? chunk.length : 0);
        console.log(`📊 Response Size:  ${responseSize} bytes`);
        
        console.log('='.repeat(80));
        console.log(`✅ REQUEST COMPLETED: ${req.method} ${req.originalUrl || req.url} - ${res.statusCode} (${responseTime}ms)`);
        console.log('='.repeat(80) + '\n');
        
        // Call original end method
        originalEnd.call(this, chunk, encoding);
    };
    
    // Continue to next middleware
    next();
};

// Helper function to get status message
function getStatusMessage(statusCode) {
    const statusMessages = {
        200: 'OK',
        201: 'Created',
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error'
    };
    return statusMessages[statusCode] || 'Unknown Status';
}

// Apply logger middleware to all routes
app.use(logger);

// MongoDB connection
let db;
const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db('lessonMarketplace');
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
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
        const { topic, location, price, space } = req.body;
        
        if (!topic || !location || price === undefined || space === undefined) {
            return res.status(400).json({ error: 'Missing required fields: topic, location, price, space' });
        }
        
        const newLesson = {
            topic: topic.trim(),
            location: location.trim(),
            price: parseFloat(price),
            space: parseInt(space),
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
app.put('/api/lessons/:id/space', async (req, res) => {
    try {
        const { change } = req.body;
        
        if (change === undefined) {
            return res.status(400).json({ error: 'Change value is required' });
        }
        
        const lesson = await db.collection('lessons').findOne({ _id: new ObjectId(req.params.id) });
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        
        const newSpace = Math.max(0, lesson.space + parseInt(change));
        
        await db.collection('lessons').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { space: newSpace } }
        );
        
        const updatedLesson = await db.collection('lessons').findOne({ _id: new ObjectId(req.params.id) });
        res.json(updatedLesson);
    } catch (error) {
        console.error('Error updating lesson space:', error);
        res.status(500).json({ error: 'Failed to update lesson space' });
    }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await db.collection('orders').find({}).sort({ orderDate: -1 }).toArray();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Create a new order (4% backend requirement: name, phoneNumber, lessonIDs, numberOfSpaces)
app.post('/api/orders', async (req, res) => {
    try {
        const { name, phoneNumber, lessonIDs, numberOfSpaces, email, notes } = req.body;
        
        // Validate required fields (4% backend requirement)
        if (!name || !phoneNumber || !lessonIDs || !numberOfSpaces) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, phoneNumber, lessonIDs, numberOfSpaces' 
            });
        }
        
        if (!Array.isArray(lessonIDs) || lessonIDs.length === 0) {
            return res.status(400).json({ 
                error: 'lessonIDs must be a non-empty array (1 or more lesson IDs)' 
            });
        }
        
        if (typeof numberOfSpaces !== 'number' || numberOfSpaces <= 0) {
            return res.status(400).json({ 
                error: 'numberOfSpaces must be a positive number' 
            });
        }
        
        // Convert lesson IDs to ObjectIds and fetch lesson details
        const lessonObjectIds = lessonIDs.map(id => new ObjectId(id));
        const lessons = await db.collection('lessons').find({ 
            _id: { $in: lessonObjectIds } 
        }).toArray();
        
        if (lessons.length !== lessonIDs.length) {
            return res.status(400).json({ 
                error: 'One or more lesson IDs not found' 
            });
        }
        
        // Calculate total price
        const totalPrice = lessons.reduce((sum, lesson) => sum + lesson.price, 0) * numberOfSpaces;
        
        const newOrder = {
            name: name.trim(),
            phoneNumber: phoneNumber.trim(),
            lessonIDs: lessonObjectIds,
            numberOfSpaces: parseInt(numberOfSpaces),
            totalPrice: totalPrice,
            orderDate: new Date(),
            status: 'pending',
            email: email ? email.trim() : null,
            notes: notes ? notes.trim() : null,
            lessonDetails: lessons.map(lesson => ({
                id: lesson._id,
                topic: lesson.topic,
                price: lesson.price,
                location: lesson.location
            }))
        };
        
        const result = await db.collection('orders').insertOne(newOrder);
        const order = await db.collection('orders').findOne({ _id: result.insertedId });
        
        console.log(`✅ New order created: ${order.name} - ${order.phoneNumber} - ${order.numberOfSpaces} spaces - £${order.totalPrice}`);
        
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
                { topic: { $regex: query, $options: 'i' } },
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
        console.log(`📋 Logger middleware active - all requests will be logged`);
        console.log(`🔍 Check console for detailed request/response logs`);
    });
});