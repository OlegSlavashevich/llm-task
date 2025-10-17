# Text Classification API

Modern API for text classification and structured information extraction using **Vercel AI SDK** with **Anthropic Claude**.

## 🚀 Features

- Extract postal codes (ZIP)
- Identify brands/companies
- Classify by categories
- Extract time preferences
- **Type-safe structured output** via Zod schemas
- **Modern AI SDK** with Claude 3.4 Sonnet

## 📋 Requirements

- Node.js 18+ 
- Anthropic API key

## 🛠 Installation

1. Clone the repository or copy the files

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your Anthropic API key to `.env`:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## 🏃 Running

### Production mode:
```bash
npm start
```

### Development mode (with auto-reload):
```bash
npm run dev
```

Server will start on `http://localhost:3000`

## 📡 API Endpoints

### POST /classify

Classifies text and extracts structured information.

**Request:**
```json
{
  "text": "Order Domino's pizza to 90210 tomorrow evening"
}
```

**Response:**
```json
{
  "zip": "90210",
  "brand": "Domino's",
  "category": "food",
  "time_pref": "tomorrow evening"
}
```

### GET /health

Service health check.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-17T12:00:00.000Z"
}
```

### GET /

API documentation and available endpoints.

## 🧪 Usage Examples

### cURL:
```bash
curl -X POST http://localhost:3000/classify \
  -H "Content-Type: application/json" \
  -d '{"text": "Order iPhone from Apple Store to 119021 tomorrow"}'
```

### JavaScript (fetch):
```javascript
const response = await fetch('http://localhost:3000/classify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Want Nike sneakers delivered to 115419 next week'
  })
});

const result = await response.json();
console.log(result);
```

### Python (requests):
```python
import requests

response = requests.post('http://localhost:3000/classify', json={
    'text': 'MacBook delivery from Apple Store to 123456 next week'
})

print(response.json())
```

## 🎯 Test Examples

1. **All fields present:**
   ```
   "Order Domino's pizza to Moscow 101000 tomorrow evening"
   ```

2. **Partial information:**
   ```
   "Need Nike sneakers for tomorrow"
   ```

3. **Category only:**
   ```
   "I need a new jacket"
   ```

4. **Russian text:**
   ```
   "Хочу заказать пиццу Додо в Москву 101000 завтра вечером"
   ```

5. **Mixed languages:**
   ```
   "Закажи iPhone из Apple на завтра в 119021"
   ```

6. **Complex example:**
   ```
   "Доставка бургеров из Burger King в офис 123456 послезавтра к обеду"
   ```

## 🔧 Technology Stack

- **Express.js** - Web framework
- **Vercel AI SDK** - Modern AI integration
- **Anthropic Claude 3.5 Sonnet** - Latest AI model
- **Zod** - Type-safe schema validation
- **dotenv** - Environment variables management

## ⚙️ Configuration

### AI Model

In `server.js` you can configure the model:
```javascript
model: anthropic('claude-3-5-sonnet-20241022') // Latest Claude model
```

### Temperature

Parameter `temperature: 0.3` ensures predictable results:
- `0.0` - Maximum determinism
- `0.3` - Balanced (current)
- `1.0` - More creative

## 📊 Modern AI Architecture

This project uses **Vercel AI SDK** which provides:

✅ **Type-safe structured output** with Zod schemas  
✅ **Unified API** across different AI providers  
✅ **Built-in error handling** for AI-specific errors  
✅ **Automatic retries** and rate limiting  
✅ **Modern async/await** patterns  

### Zod Schema Definition

```javascript
const classificationSchema = z.object({
  zip: z.string().nullable().describe("Postal code (ZIP code), if found in the text"),
  brand: z.string().nullable().describe("Brand or company name, if mentioned"),
  category: z.string().nullable().describe("Product or service category"),
  time_pref: z.string().nullable().describe("Time preferences")
});
```

### AI SDK Usage

```javascript
const { object } = await generateObject({
  model: anthropic('claude-3-5-sonnet-20241022'),
  schema: classificationSchema,
  prompt: `Your extraction prompt here...`,
  temperature: 0.3,
});
```

## 🐛 Error Handling

API returns clear error messages:

- `400 Bad Request` - Invalid request format
- `401 Unauthorized` - Invalid API key
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server or validation error

### Example Error Response:
```json
{
  "error": "Field \"text\" is required and must be a string"
}
```

### AI-Specific Errors:
```json
{
  "error": "Invalid Anthropic API key"
}
```

### Schema Validation Errors:
```json
{
  "error": "Schema validation failed"
}
```

## 💰 Cost Estimation

Anthropic Claude pricing (approximate):
- **Claude 3.5 Sonnet**: ~$3.00 per 1M input tokens, ~$15.00 per 1M output tokens
- Typical request (~100 input, ~30 output tokens): **~$0.00075**

Much more cost-effective than GPT-4 for similar quality!

## 🔒 Security

- API key stored in environment variables
- Input validation with Zod schemas
- Error message filtering in production
- No sensitive data logging
- Type-safe operations

## 🚀 Deployment

### Docker:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables:
```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3000
NODE_ENV=production
```
