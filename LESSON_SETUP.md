# MongoDB Lesson Data Setup

This script automatically inserts 10 sample lessons into your MongoDB collection with the required fields: **topic**, **price**, **location**, and **space**.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd express
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update with your MongoDB connection:
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB Atlas connection string:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lessonMarketplace
DATABASE_NAME=lessonMarketplace
PORT=3000
```

### 3. Insert Sample Lessons
Run the automatic insertion script:
```bash
npm run insert-lessons
```

Or directly:
```bash
node insertLessons.js
```

## 📊 Sample Data

The script inserts 10 lessons with these required fields:

| Topic | Price (£) | Location | Space |
|-------|-----------|----------|-------|
| Mathematics | 25 | London | 10 |
| English Literature | 30 | Manchester | 8 |
| Physics | 35 | Birmingham | 6 |
| Chemistry | 28 | Liverpool | 12 |
| History | 22 | Leeds | 15 |
| Biology | 32 | Edinburgh | 9 |
| Art & Design | 40 | Glasgow | 5 |
| Music Theory | 45 | Bristol | 7 |
| Computer Science | 50 | Cambridge | 4 |
| French Language | 27 | Oxford | 11 |

## ✅ Expected Output

```
🚀 Starting lesson insertion script...
📍 Database: lessonMarketplace
📁 Collection: lessons
🔌 Connecting to MongoDB...
✅ Connected to MongoDB successfully
📊 Current lessons in database: 0
📝 Inserting 10 sample lessons...
✅ Successfully inserted 10 lessons
📊 Total lessons in database: 10
📇 Creating database indexes...
✅ Database indexes created successfully

📚 Sample of inserted lessons:
1. Mathematics - £25 - London (10 spaces)
2. English Literature - £30 - Manchester (8 spaces)
3. Physics - £35 - Birmingham (6 spaces)
4. Chemistry - £28 - Liverpool (12 spaces)
5. History - £22 - Leeds (15 spaces)

📈 Database Statistics:
   • Total Lessons: 10
   • Average Price: £32.40
   • Total Available Spaces: 87
   • Price Range: £22 - £50

🎉 Lesson insertion completed successfully!
```

## 🔧 Features

- ✅ **Required Fields**: topic, price, location, space (as specified)
- ✅ **Data Validation**: Ensures all required fields are present and valid
- ✅ **Database Indexes**: Creates indexes for better query performance
- ✅ **Error Handling**: Comprehensive error handling and troubleshooting
- ✅ **Statistics**: Shows database statistics after insertion
- ✅ **Duplicate Safe**: Can be run multiple times safely

## 🛠️ Troubleshooting

### MongoDB Connection Issues:
1. Check your `.env` file has the correct `MONGODB_URI`
2. Ensure your MongoDB Atlas cluster is running
3. Verify network access is configured in Atlas
4. Check username/password in connection string

### Script Errors:
```bash
# Check if all dependencies are installed
npm install

# Verify your .env file exists
ls -la .env

# Test MongoDB connection
node -e "console.log(process.env.MONGODB_URI)" 
```

## 🚀 Next Steps

After running this script:
1. Your MongoDB collection will have 10 sample lessons
2. Start your Express server: `npm start`
3. Test your API endpoints
4. Connect your Vue.js frontend to fetch the lesson data

## 📝 Collection Schema

```javascript
{
  _id: ObjectId,
  topic: String,        // Required: Subject/topic
  price: Number,        // Required: Price in GBP
  location: String,     // Required: City/location  
  space: Number,        // Required: Available spaces
  instructor: String,   // Optional: Instructor name
  duration: String,     // Optional: Lesson duration
  level: String,        // Optional: Difficulty level
  description: String,  // Optional: Lesson description
  createdAt: Date      // Optional: Creation timestamp
}
```
