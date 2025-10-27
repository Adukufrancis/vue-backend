const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'lessonHub';
const ORDERS_COLLECTION = 'orders';

async function setupOrdersCollection() {
    let client;
    
    try {
        console.log('🚀 Setting up empty orders collection...');
        console.log(`📍 Database: ${DATABASE_NAME}`);
        console.log(`📁 Collection: ${ORDERS_COLLECTION}`);
        console.log(`🔗 MongoDB URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
        console.log('─'.repeat(60));
        
        console.log('🔌 Connecting to MongoDB...');
        
        // Connect to MongoDB
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        
        console.log('✅ Connected to MongoDB successfully');
        
        // Get database
        const db = client.db(DATABASE_NAME);
        
        // Create orders collection (will be created when first document is inserted)
        const ordersCollection = db.collection(ORDERS_COLLECTION);
        
        // Check if collection already exists and has documents
        const existingCount = await ordersCollection.countDocuments();
        console.log(`📊 Current orders in collection: ${existingCount}`);
        
        if (existingCount > 0) {
            console.log('⚠️  Orders collection already contains data');
            console.log('✅ Collection is ready for new orders from user purchases');
        } else {
            console.log('📝 Setting up empty orders collection...');
            
            // Create indexes for better query performance (even on empty collection)
            console.log('📇 Creating database indexes...');
            await ordersCollection.createIndex({ name: 1 });
            await ordersCollection.createIndex({ phoneNumber: 1 });
            await ordersCollection.createIndex({ lessonIDs: 1 });
            await ordersCollection.createIndex({ numberOfSpaces: 1 });
            await ordersCollection.createIndex({ orderDate: -1 });
            await ordersCollection.createIndex({ status: 1 });
            
            console.log('✅ Empty orders collection created with indexes');
        }
        
        // Show the required schema for orders (4% backend requirement)
        console.log('\n📋 Orders Collection Schema (4% Backend Requirement):');
        console.log('Required fields:');
        console.log('  ✅ name: String           - Customer name');
        console.log('  ✅ phoneNumber: String    - Customer phone number');
        console.log('  ✅ lessonIDs: [ObjectId]  - Array of lesson IDs (1 or more)');
        console.log('  ✅ numberOfSpaces: Number - Number of spaces booked');
        console.log('\nOptional fields:');
        console.log('  • orderDate: Date        - When order was placed');
        console.log('  • status: String         - Order status (pending, confirmed, etc.)');
        console.log('  • totalPrice: Number     - Calculated total price');
        console.log('  • email: String          - Customer email');
        console.log('  • notes: String          - Additional notes');
        
        console.log('\n📝 Example order document:');
        console.log(JSON.stringify({
            name: "John Smith",
            phoneNumber: "+44 7700 900123",
            lessonIDs: ["ObjectId('...')", "ObjectId('...')"],
            numberOfSpaces: 2,
            orderDate: "2024-10-26T10:08:00.000Z",
            status: "pending",
            totalPrice: 120,
            email: "john.smith@email.com",
            notes: "Weekend sessions preferred"
        }, null, 2));
        
        console.log('\n🎯 Collection Design:');
        console.log('• EMPTY by default - no sample data');
        console.log('• Gets populated when users make purchases');
        console.log('• lessonIDs array supports 1 or more lessons per order');
        console.log('• Flexible design for various order scenarios');
        
        console.log('\n🎉 Empty orders collection setup completed!');
        console.log('💡 Collection is ready to receive orders from user purchases');
        console.log('🛒 When users checkout, orders will be automatically inserted');
        
    } catch (error) {
        console.error('❌ Error setting up orders collection:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 MongoDB Connection Troubleshooting:');
            console.log('   1. Make sure MongoDB is running locally: mongod');
            console.log('   2. Or check your MongoDB Atlas connection string');
            console.log('   3. Verify your .env file has the correct MONGODB_URI');
        }
        
        process.exit(1);
        
    } finally {
        // Close the connection
        if (client) {
            await client.close();
            console.log('🔌 MongoDB connection closed');
        }
    }
}

// Function to validate order data (for use in your API)
function validateOrderData(orderData) {
    const requiredFields = ['name', 'phoneNumber', 'lessonIDs', 'numberOfSpaces'];
    
    for (const field of requiredFields) {
        if (!orderData.hasOwnProperty(field) || orderData[field] === null || orderData[field] === undefined) {
            throw new Error(`Order is missing required field: ${field}`);
        }
    }
    
    // Validate data types
    if (typeof orderData.name !== 'string' || orderData.name.trim() === '') {
        throw new Error('name must be a non-empty string');
    }
    
    if (typeof orderData.phoneNumber !== 'string' || orderData.phoneNumber.trim() === '') {
        throw new Error('phoneNumber must be a non-empty string');
    }
    
    if (!Array.isArray(orderData.lessonIDs) || orderData.lessonIDs.length === 0) {
        throw new Error('lessonIDs must be a non-empty array');
    }
    
    if (typeof orderData.numberOfSpaces !== 'number' || orderData.numberOfSpaces <= 0) {
        throw new Error('numberOfSpaces must be a positive number');
    }
    
    return true;
}

// Main execution
async function main() {
    try {
        await setupOrdersCollection();
        
        console.log('─'.repeat(60));
        console.log('✨ Setup completed successfully!');
        console.log('🚀 Your empty orders collection is ready for user purchases');
        console.log('📡 Use POST /api/orders endpoint to insert orders when users buy');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    }
}

// Handle script execution
if (require.main === module) {
    main();
}

module.exports = { setupOrdersCollection, validateOrderData };
