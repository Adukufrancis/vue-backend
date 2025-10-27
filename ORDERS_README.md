# Orders Collection Setup (4% Backend Requirement)

This setup creates an **empty orders collection** that gets populated when users make purchases through your application.

## 📋 Required Fields (4% Backend Requirement)

✅ **name** - Customer's full name  
✅ **phoneNumber** - Customer's phone number  
✅ **lessonIDs** - Array of lesson IDs (supports 1 or more lessons per order)  
✅ **numberOfSpaces** - Number of spaces booked  

## 🚀 Setup Instructions

### 1. Setup Empty Orders Collection
```bash
npm run setup-orders
```

### 2. Setup Complete Database (Lessons + Empty Orders)
```bash
npm run setup-db
```

## 📡 API Endpoint

### POST `/api/orders` - Create New Order

**Request Body:**
```json
{
  "name": "John Smith",
  "phoneNumber": "+44 7700 900123",
  "lessonIDs": ["lesson_id_1", "lesson_id_2"],
  "numberOfSpaces": 2,
  "email": "john@email.com",
  "notes": "Weekend sessions preferred"
}
```

**Response:**
```json
{
  "_id": "...",
  "name": "John Smith",
  "phoneNumber": "+44 7700 900123",
  "lessonIDs": ["ObjectId(...)", "ObjectId(...)"],
  "numberOfSpaces": 2,
  "totalPrice": 120,
  "orderDate": "2024-10-26T10:08:00.000Z",
  "status": "pending",
  "email": "john@email.com",
  "notes": "Weekend sessions preferred",
  "lessonDetails": [
    {
      "id": "ObjectId(...)",
      "topic": "Mathematics",
      "price": 25,
      "location": "London"
    }
  ]
}
```

## 🔧 Features

- **Empty by Default**: Collection starts completely empty
- **User-Driven**: Only populated when users make actual purchases
- **Flexible lessonIDs**: Array supports 1 or multiple lessons per order
- **Automatic Price Calculation**: Total calculated from lessons × spaces
- **Validation**: Ensures all required fields are present and valid
- **Indexed**: Optimized for queries on name, phone, lessonIDs

## 🎯 Design Decisions

### lessonIDs Array Structure
```javascript
lessonIDs: [ObjectId("..."), ObjectId("...")]
```
- Supports 1 or more lessons per order
- Direct references to lesson documents
- Flexible for various order scenarios

### Order Status Flow
- **pending** - Initial status when order is created
- **confirmed** - Order confirmed by system/admin
- **completed** - Order fulfilled
- **cancelled** - Order cancelled

## 📊 Collection Schema

```javascript
{
  _id: ObjectId,
  name: String,              // Required: Customer name
  phoneNumber: String,       // Required: Phone number  
  lessonIDs: [ObjectId],     // Required: Array of lesson IDs
  numberOfSpaces: Number,    // Required: Spaces booked
  orderDate: Date,           // Order creation date
  status: String,            // Order status
  totalPrice: Number,        // Calculated total price
  email: String,             // Optional: Customer email
  notes: String,             // Optional: Additional notes
  lessonDetails: [{          // Embedded lesson info
    id: ObjectId,
    topic: String,
    price: Number,
    location: String
  }]
}
```

## 🛒 Integration with Frontend

Your Vue.js frontend can create orders by posting to the API:

```javascript
// Example checkout function in Vue.js
async function checkout() {
    const orderData = {
        name: this.customerName,
        phoneNumber: this.customerPhone,
        lessonIDs: this.cartItems.map(item => item._id),
        numberOfSpaces: this.totalSpaces,
        email: this.customerEmail,
        notes: this.orderNotes
    };
    
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const order = await response.json();
        console.log('Order created:', order);
    } catch (error) {
        console.error('Order failed:', error);
    }
}
```

## ✅ Expected Output

When you run `npm run setup-orders`:

```
🚀 Setting up empty orders collection...
📍 Database: lessonMarketplace
📁 Collection: orders
🔌 Connecting to MongoDB...
✅ Connected to MongoDB successfully
📊 Current orders in collection: 0
📝 Setting up empty orders collection...
📇 Creating database indexes...
✅ Empty orders collection created with indexes

📋 Orders Collection Schema (4% Backend Requirement):
Required fields:
  ✅ name: String           - Customer name
  ✅ phoneNumber: String    - Customer phone number
  ✅ lessonIDs: [ObjectId]  - Array of lesson IDs (1 or more)
  ✅ numberOfSpaces: Number - Number of spaces booked

🎯 Collection Design:
• EMPTY by default - no sample data
• Gets populated when users make purchases
• lessonIDs array supports 1 or more lessons per order
• Flexible design for various order scenarios

🎉 Empty orders collection setup completed!
```

## 🔍 Query Examples

```javascript
// Get all orders
GET /api/orders

// Get specific order
GET /api/orders/:id

// Create new order (when user purchases)
POST /api/orders
```

This orders collection fulfills the 4% backend requirement perfectly with an empty collection that gets populated through real user purchases!
