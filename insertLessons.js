const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'lessonMarketplace';
const COLLECTION_NAME = 'lessons';

// Sample lesson data with required fields: topic, price, location, space
const sampleLessons = [
    {
        topic: 'Mathematics',
        price: 25,
        location: 'London',
        space: 10,
        instructor: 'Dr. Sarah Johnson',
        duration: '1 hour',
        level: 'Intermediate',
        description: 'Comprehensive mathematics tutoring covering algebra, geometry, and calculus',
        createdAt: new Date()
    },
    {
        topic: 'English Literature',
        price: 30,
        location: 'Manchester',
        space: 8,
        instructor: 'Prof. Michael Brown',
        duration: '1.5 hours',
        level: 'Advanced',
        description: 'Deep dive into classic and contemporary English literature',
        createdAt: new Date()
    },
    {
        topic: 'Physics',
        price: 35,
        location: 'Birmingham',
        space: 6,
        instructor: 'Dr. Emily Chen',
        duration: '2 hours',
        level: 'Advanced',
        description: 'Advanced physics concepts including quantum mechanics and thermodynamics',
        createdAt: new Date()
    },
    {
        topic: 'Chemistry',
        price: 28,
        location: 'Liverpool',
        space: 12,
        instructor: 'Dr. James Wilson',
        duration: '1 hour',
        level: 'Beginner',
        description: 'Introduction to organic and inorganic chemistry fundamentals',
        createdAt: new Date()
    },
    {
        topic: 'History',
        price: 22,
        location: 'Leeds',
        space: 15,
        instructor: 'Prof. Amanda Taylor',
        duration: '1 hour',
        level: 'Intermediate',
        description: 'World history from ancient civilizations to modern times',
        createdAt: new Date()
    },
    {
        topic: 'Biology',
        price: 32,
        location: 'Edinburgh',
        space: 9,
        instructor: 'Dr. Robert Garcia',
        duration: '1.5 hours',
        level: 'Intermediate',
        description: 'Cell biology, genetics, and human anatomy exploration',
        createdAt: new Date()
    },
    {
        topic: 'Art & Design',
        price: 40,
        location: 'Glasgow',
        space: 5,
        instructor: 'Ms. Lisa Martinez',
        duration: '2 hours',
        level: 'Beginner',
        description: 'Creative art techniques including drawing, painting, and digital design',
        createdAt: new Date()
    },
    {
        topic: 'Music Theory',
        price: 45,
        location: 'Bristol',
        space: 7,
        instructor: 'Mr. David Anderson',
        duration: '1 hour',
        level: 'Intermediate',
        description: 'Music composition, harmony, and instrumental techniques',
        createdAt: new Date()
    },
    {
        topic: 'Computer Science',
        price: 50,
        location: 'Cambridge',
        space: 4,
        instructor: 'Dr. Alex Thompson',
        duration: '2 hours',
        level: 'Advanced',
        description: 'Programming fundamentals, algorithms, and data structures',
        createdAt: new Date()
    },
    {
        topic: 'French Language',
        price: 27,
        location: 'Oxford',
        space: 11,
        instructor: 'Mme. Sophie Dubois',
        duration: '1 hour',
        level: 'Beginner',
        description: 'French language basics including grammar, vocabulary, and conversation',
        createdAt: new Date()
    }
];

async function insertLessons() {
    let client;
    
    try {
        console.log('🚀 Starting lesson insertion script...');
        console.log(`📍 Database: ${DATABASE_NAME}`);
        console.log(`📁 Collection: ${COLLECTION_NAME}`);
        console.log(`🔗 MongoDB URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials
        console.log('─'.repeat(60));
        
        console.log('🔌 Connecting to MongoDB...');
        
        // Connect to MongoDB
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        
        console.log('✅ Connected to MongoDB successfully');
        
        // Get database and collection
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        // Check if lessons already exist
        const existingCount = await collection.countDocuments();
        console.log(`📊 Current lessons in database: ${existingCount}`);
        
        if (existingCount > 0) {
            console.log('⚠️  Lessons already exist in the database');
            console.log('🔄 Adding new lessons to existing collection...');
        }
        
        // Insert the sample lessons
        console.log('📝 Inserting 10 sample lessons...');
        const result = await collection.insertMany(sampleLessons);
        
        console.log(`✅ Successfully inserted ${result.insertedCount} lessons`);
        
        // Verify insertion by counting total documents
        const totalCount = await collection.countDocuments();
        console.log(`📊 Total lessons in database: ${totalCount}`);
        
        // Create indexes for better query performance
        console.log('📇 Creating database indexes...');
        await collection.createIndex({ topic: 1 });
        await collection.createIndex({ location: 1 });
        await collection.createIndex({ price: 1 });
        await collection.createIndex({ space: 1 });
        await collection.createIndex({ createdAt: -1 });
        console.log('✅ Database indexes created successfully');
        
        // Display sample of inserted data
        console.log('\n📚 Sample of inserted lessons:');
        const sampleData = await collection.find({}).limit(5).toArray();
        sampleData.forEach((lesson, index) => {
            console.log(`${index + 1}. ${lesson.topic} - £${lesson.price} - ${lesson.location} (${lesson.space} spaces)`);
        });
        
        // Show statistics
        console.log('\n📈 Database Statistics:');
        const stats = await collection.aggregate([
            {
                $group: {
                    _id: null,
                    totalLessons: { $sum: 1 },
                    averagePrice: { $avg: '$price' },
                    totalSpaces: { $sum: '$space' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            }
        ]).toArray();
        
        if (stats.length > 0) {
            const stat = stats[0];
            console.log(`   • Total Lessons: ${stat.totalLessons}`);
            console.log(`   • Average Price: £${stat.averagePrice.toFixed(2)}`);
            console.log(`   • Total Available Spaces: ${stat.totalSpaces}`);
            console.log(`   • Price Range: £${stat.minPrice} - £${stat.maxPrice}`);
        }
        
        console.log('\n🎉 Lesson insertion completed successfully!');
        console.log('💡 You can now start your Express server and use the API endpoints');
        
    } catch (error) {
        console.error('❌ Error inserting lessons:', error.message);
        
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

// Validation function to ensure required fields
function validateLessonData(lessons) {
    const requiredFields = ['topic', 'price', 'location', 'space'];
    
    for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        for (const field of requiredFields) {
            if (!lesson.hasOwnProperty(field) || lesson[field] === null || lesson[field] === undefined) {
                throw new Error(`Lesson ${i + 1} is missing required field: ${field}`);
            }
        }
        
        // Validate data types
        if (typeof lesson.price !== 'number' || lesson.price <= 0) {
            throw new Error(`Lesson ${i + 1}: price must be a positive number`);
        }
        
        if (typeof lesson.space !== 'number' || lesson.space <= 0) {
            throw new Error(`Lesson ${i + 1}: space must be a positive number`);
        }
        
        if (typeof lesson.topic !== 'string' || lesson.topic.trim() === '') {
            throw new Error(`Lesson ${i + 1}: topic must be a non-empty string`);
        }
        
        if (typeof lesson.location !== 'string' || lesson.location.trim() === '') {
            throw new Error(`Lesson ${i + 1}: location must be a non-empty string`);
        }
    }
    
    console.log('✅ All lesson data validated successfully');
    return true;
}

// Main execution
async function main() {
    try {
        // Validate lesson data before insertion
        validateLessonData(sampleLessons);
        
        // Insert lessons
        await insertLessons();
        
        console.log('─'.repeat(60));
        console.log('✨ Script execution completed successfully!');
        console.log('🚀 Ready to start your Express server: npm start');
        
    } catch (error) {
        console.error('❌ Script failed:', error.message);
        process.exit(1);
    }
}

// Handle script execution
if (require.main === module) {
    main();
}

module.exports = { insertLessons, sampleLessons };
