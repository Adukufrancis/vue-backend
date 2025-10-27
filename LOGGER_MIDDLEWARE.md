# Logger Middleware Documentation (4% Backend Requirement)

This document explains the logger middleware implementation in the Express.js server that outputs all requests to the server console.

## 📋 Overview

The logger middleware captures and logs comprehensive information about every HTTP request and response processed by the server. This is essential for debugging, monitoring, and understanding server behavior.

## 🔧 Implementation Details

### Location
- **File**: `server.js` (lines 13-122)
- **Applied**: To all routes using `app.use(logger)`
- **Position**: After basic middleware (cors, express.json) but before routes

### Code Structure
```javascript
const logger = (req, res, next) => {
    // Request logging logic
    // Response time tracking
    // Response logging via res.end override
    next(); // Continue to next middleware
};
```

## 🎯 Logger Middleware Features (4% Backend Requirement)

### ✅ **Complete Request Logging:**
1. **Timestamp** - ISO 8601 format for precise timing
2. **HTTP Method** - GET, POST, PUT, DELETE, etc.
3. **URL Information** - Both relative and full URLs
4. **Client Details** - IP address and User Agent
5. **Request Headers** - All headers (sensitive ones hidden)
6. **Query Parameters** - URL query string data
7. **Request Body** - POST/PUT/PATCH body content
8. **Content Length** - Size of request payload

### ✅ **Complete Response Logging:**
1. **Response Time** - Processing time in milliseconds
2. **Status Code** - HTTP status with description
3. **Response Headers** - All outgoing headers
4. **Response Size** - Size of response payload
5. **Completion Summary** - Final request status

## 📊 What Gets Logged

### 📥 Incoming Request Information:
1. **Timestamp** - ISO 8601 format timestamp
2. **HTTP Method** - GET, POST, PUT, DELETE, etc.
3. **URL Path** - The requested endpoint
4. **Full URL** - Complete URL including protocol and host
5. **Client IP Address** - Handles various proxy scenarios
6. **User Agent** - Browser/client information
7. **Content Length** - Size of request body
8. **Headers** - All HTTP headers (sensitive ones hidden)
9. **Query Parameters** - URL query string parameters
10. **Request Body** - For POST/PUT/PATCH requests (truncated if large)

### 📤 Outgoing Response Information:
1. **Response Time** - Time taken to process request (in milliseconds)
2. **Status Code** - HTTP status code with description
3. **Response Headers** - All response headers
4. **Response Size** - Size of response body
5. **Completion Summary** - Final status line

## 🎯 Example Log Output

### GET Request Example:
```
================================================================================
📥 INCOMING REQUEST
================================================================================
🕐 Timestamp:     2024-10-26T10:14:32.123Z
🌐 Method:        GET
📍 URL:           /api/lessons
🔗 Full URL:      http://localhost:3000/api/lessons
💻 Client IP:     ::1
📱 User Agent:    Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...
📊 Content-Length: 0 bytes
📋 Headers:
   host: localhost:3000
   connection: keep-alive
   accept: application/json
   user-agent: Mozilla/5.0...

--------------------------------------------------------------------------------
📤 OUTGOING RESPONSE
--------------------------------------------------------------------------------
🕐 Response Time:  45ms
📊 Status Code:    200 OK
📋 Response Headers:
   x-powered-by: Express
   access-control-allow-origin: *
   content-type: application/json; charset=utf-8
   content-length: 1247
📊 Response Size:  1247 bytes
================================================================================
✅ REQUEST COMPLETED: GET /api/lessons - 200 (45ms)
================================================================================
```

### POST Request Example:
```
================================================================================
📥 INCOMING REQUEST
================================================================================
🕐 Timestamp:     2024-10-26T10:15:45.678Z
🌐 Method:        POST
📍 URL:           /api/orders
🔗 Full URL:      http://localhost:3000/api/orders
💻 Client IP:     ::1
📱 User Agent:    Mozilla/5.0...
📊 Content-Length: 156 bytes
📋 Headers:
   host: localhost:3000
   content-type: application/json
   accept: application/json
📝 Request Body:  {
  "name": "John Smith",
  "phoneNumber": "+44 7700 900123",
  "lessonIDs": ["67123abc456def789"],
  "numberOfSpaces": 2
}

--------------------------------------------------------------------------------
📤 OUTGOING RESPONSE
--------------------------------------------------------------------------------
🕐 Response Time:  127ms
📊 Status Code:    201 Created
📋 Response Headers:
   content-type: application/json; charset=utf-8
   content-length: 298
📊 Response Size:  298 bytes
================================================================================
✅ REQUEST COMPLETED: POST /api/orders - 201 (127ms)
================================================================================
```

## 🔒 Security Features

### Protected Information:
- **Sensitive Headers**: Authorization, Cookie, X-API-Key headers are hidden
- **Large Bodies**: Request bodies over 500 characters are truncated
- **IP Handling**: Properly handles various proxy configurations

### Security Headers Hidden:
```javascript
const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
// These show as: "authorization: [HIDDEN FOR SECURITY]"
```

## ⚡ Performance Considerations

### Response Time Tracking:
```javascript
const startTime = Date.now();
// ... process request ...
const responseTime = Date.now() - startTime;
```

### Efficient Logging:
- Uses console.log for immediate output
- Truncates large request bodies to prevent memory issues
- Only logs relevant information based on request type

## 🎯 Benefits for Development

### 1. **Debugging**
- See exactly what requests are coming in
- Identify slow endpoints (response time tracking)
- Debug request/response headers

### 2. **Monitoring**
- Track API usage patterns
- Monitor error rates (status codes)
- Identify performance bottlenecks

### 3. **Security**
- Monitor for suspicious requests
- Track client IP addresses
- Identify unusual user agents

### 4. **API Documentation**
- Real-time view of how APIs are being used
- Understand request/response patterns
- Validate API behavior

## 📝 How to Inspect and Explain Logs

### When analyzing logs, look for:

1. **Request Pattern**: `Method + URL + Status Code`
2. **Performance**: Response time in milliseconds
3. **Client Info**: IP address and User Agent
4. **Data Flow**: Request body → Response size
5. **Error Tracking**: Non-200 status codes

### Example Analysis:
```
✅ REQUEST COMPLETED: POST /api/orders - 201 (127ms)
```
**Explanation**: 
- A POST request to create an order
- Successfully created (201 status)
- Took 127ms to process
- This indicates normal, healthy API operation

```
✅ REQUEST COMPLETED: GET /api/lessons/invalid-id - 404 (12ms)
```
**Explanation**:
- A GET request for a specific lesson
- Resource not found (404 status)
- Fast response (12ms) indicates efficient error handling
- Could indicate client-side error or invalid data

## 🚀 Usage in Development

Start your server and watch the console:
```bash
npm start
# or
npm run dev
```

Every request to your API will generate detailed logs, making it easy to:
- Debug issues
- Monitor performance
- Understand client behavior
- Validate API responses

This logger middleware fulfills the 4% backend requirement by providing comprehensive request logging that can be easily inspected and explained for debugging and monitoring purposes.
