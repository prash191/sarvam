# Sarvam Widget - Backend Server

Express.js backend API for the Sarvam chat widget. Handles secure communication with Google Gemini AI.

## Features

- RESTful API endpoints for chat functionality
- Session-based chat management
- Google Gemini AI integration
- CORS enabled for cross-origin requests
- Environment-based configuration
- Error handling and logging

## Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```bash
GEMINI_API_KEY=your_api_key_here
PORT=3001
```

### Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3001`

## API Endpoints

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### POST /api/chat/init
Initialize a new chat session

**Request:**
```json
{
  "sessionId": "unique-session-id",
  "context": "You are a helpful assistant"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chat session initialized",
  "sessionId": "unique-session-id"
}
```

### POST /api/chat/message
Send a message to the chat

**Request:**
```json
{
  "sessionId": "unique-session-id",
  "message": "Hello, how are you?",
  "context": "You are a helpful assistant"
}
```

**Response:**
```json
{
  "success": true,
  "response": "I'm doing well, thank you for asking! How can I help you today?",
  "sessionId": "unique-session-id"
}
```

### POST /api/chat/reset
Reset a chat session

**Request:**
```json
{
  "sessionId": "unique-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chat session reset",
  "sessionId": "unique-session-id"
}
```

## Session Management

Sessions are stored in-memory using a Map. In production, consider using:
- Redis for distributed sessions
- Database for persistent sessions
- Session middleware like express-session

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (missing parameters)
- 500: Internal Server Error

Error responses include:
```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

## Deployment

### Vercel (Serverless)

The server is configured to run as a Vercel serverless function. See main DEPLOYMENT.md for details.

### Traditional Hosting

```bash
# Install production dependencies
npm install --production

# Start server
npm start
```

## Security Considerations

1. **API Keys**: Never commit API keys. Use environment variables.
2. **CORS**: Configure CORS appropriately for production.
3. **Rate Limiting**: Consider adding rate limiting in production.
4. **Authentication**: Add authentication if needed for your use case.
5. **Input Validation**: Validate all user inputs.

## Development

### Project Structure

```
server/
├── index.js          # Main server file
├── package.json      # Dependencies
├── .env             # Environment variables (not in git)
└── README.md        # This file
```

### Adding New Endpoints

1. Add route handler in `index.js`
2. Implement logic
3. Add error handling
4. Test locally
5. Document in this README

## Testing

### Manual Testing

```bash
# Health check
curl http://localhost:3001/api/health

# Initialize chat
curl -X POST http://localhost:3001/api/chat/init \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-123","context":"You are helpful"}'

# Send message
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-123","message":"Hello"}'

# Reset session
curl -X POST http://localhost:3001/api/chat/reset \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-123"}'
```

## Troubleshooting

### Port already in use
```bash
# Find process using port 3001
lsof -i :3001
# Kill the process
kill -9 <PID>
```

### API Key errors
- Verify the key is correct in `.env`
- Check key has proper permissions in Google AI Studio
- Ensure `.env` file is in server directory

### CORS errors
- Verify CORS is enabled in `index.js`
- Check allowed origins match your client URL
- Ensure preflight requests are handled

## License

MIT

