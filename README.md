# Text Classification API

API for text classification and structured information extraction using OpenAI Structured Output.

## 🚀 Features

- Extract postal codes (ZIP)
- Identify brands/companies
- Classify by categories
- Extract time preferences
- **Guaranteed valid JSON** via OpenAI Structured Output
- Support for Russian and English languages

## 📋 Requirements

- Node.js 14+ 
- OpenAI API key (paid account required)

## 🛠 Installation

1. Clone the repository or copy the files

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=sk-your-key-here
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

## 🔧 Technology Stack

- **Express.js** - Web framework
- **OpenAI API** - Text processing with Structured Output
- **JSON Schema** - Guaranteed response format
- **dotenv** - Environment variables management

## ⚙️ Configuration

### OpenAI Models

In `server.js` you can choose the model:
- `gpt-4o-mini` - Fast and cost-effective (recommended)
- `gpt-4o` - More accurate but more expensive

### Temperature

Parameter `temperature: 0.3` ensures predictable results. You can adjust:
- `0.0` - Maximum determinism
- `0.3` - Balanced (current)
- `1.0` - More creative

## 📊 Structured Output

This project uses **OpenAI Structured Output** with JSON Schema, which guarantees:

✅ Always valid JSON  
✅ Strict schema compliance  
✅ All required fields present  
✅ No extra fields  
✅ Type safety  

### Schema Definition

```javascript
const classificationSchema = {
  type: "object",
  properties: {
    zip: {
      type: ["string", "null"],
      description: "Postal code (ZIP code), if found in the text"
    },
    brand: {
      type: ["string", "null"],
      description: "Brand or company name, if mentioned"
    },
    category: {
      type: ["string", "null"],
      description: "Product or service category (e.g., food, electronics, clothing)"
    },
    time_pref: {
      type: ["string", "null"],
      description: "Time preferences (e.g., today, tomorrow, evening, morning)"
    }
  },
  required: ["zip", "brand", "category", "time_pref"],
  additionalProperties: false
};
```

## 🐛 Error Handling

API returns clear error messages:

- `400 Bad Request` - Invalid request format
- `401 Unauthorized` - Invalid API key
- `402 Payment Required` - OpenAI quota exceeded
- `500 Internal Server Error` - Server error

### Example Error Response:
```json
{
  "error": "Field \"text\" is required and must be a string"
}
```

## 💰 Cost Estimation

OpenAI pricing (approximate):
- **gpt-4o-mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **gpt-4o**: ~$2.50 per 1M input tokens, ~$10.00 per 1M output tokens

Typical request (~100 tokens) costs: **$0.00007** (gpt-4o-mini)

## 🔒 Security

- API key stored in environment variables
- Input validation
- Error message filtering in production
- No sensitive data logging

## 🚀 Deployment

### Docker (optional):
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
OPENAI_API_KEY=sk-your-key-here
PORT=3000
NODE_ENV=production
```

## 🧪 Testing

Test your OpenAI API key:
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "Hello"}]}'
```

## 📈 Performance

- **Response time**: ~500-2000ms (depends on OpenAI API)
- **Throughput**: Limited by OpenAI rate limits
- **Accuracy**: High (thanks to structured output)

## 🔄 Alternative APIs

If you need free alternatives:
- **Groq** (free tier, Llama models)
- **Hugging Face** (free inference API)
- **Together AI** (free credits)

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
- Check the error messages in the API response
- Verify your OpenAI API key is valid
- Ensure you have sufficient credits
- Review the request format

---

**Made with ❤️ using OpenAI Structured Output**