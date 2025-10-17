require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(express.json());

// JSON Schema for Structured Output
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

// Endpoint for text classification
app.post('/classify', async (req, res) => {
  try {
    const { text } = req.body;

    // Validate input data
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Field "text" is required and must be a string'
      });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({
        error: 'Text cannot be empty'
      });
    }

    // Call OpenAI API with Structured Output
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4o for better quality
      messages: [
        {
          role: "system",
          content: `You are a professional information extraction specialist. Your task is to analyze text and extract specific structured data with high accuracy.

EXTRACTION TARGETS:
1. ZIP CODE: Any postal/ZIP code (5-6 digits, may include letters for international codes)
2. BRAND: Company, store, or service provider names (e.g., "Apple", "McDonald's", "Додо Пицца")
3. CATEGORY: Product/service type from these domains:
   - Food & Dining: pizza, burgers, restaurants, delivery
   - Electronics: phones, laptops, gadgets, tech
   - Clothing & Fashion: shoes, apparel, accessories
   - Retail: stores, shopping, general merchandise
   - Services: delivery, repair, consultation
4. TIME PREFERENCE: Temporal indicators (today, tomorrow, evening, morning, weekend, specific dates)

PROCESSING RULES:
- Extract the most specific and relevant information
- For brands: prefer official names over generic terms
- For categories: choose the most specific applicable category
- For time: extract the most immediate/relevant time reference
- Return null for any field where no clear information exists
- Prioritize explicit mentions over implied information
- Respond in the same language as the user's input text

QUALITY STANDARDS:
- Be conservative: only extract information you're confident about
- Maintain consistency in field naming and format
- Handle abbreviations and colloquial terms appropriately`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "classification_result",
          strict: true,
          schema: classificationSchema
        }
      },
      temperature: 0.3, // Low temperature for more predictable results
    });

    // Extract result - guaranteed valid JSON thanks to structured output
    const result = JSON.parse(completion.choices[0].message.content);

    // Return result (only requested data)
    res.json(result);

  } catch (error) {
    console.error('Error processing request:', error);
    
    // Handle different error types
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({
        error: 'OpenAI API quota exceeded'
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({
        error: 'Invalid OpenAI API key'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Healthcheck endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Main page with documentation
app.get('/', (req, res) => {
  res.json({
    service: 'Text Classification API',
    version: '1.0.0',
    endpoints: {
      '/classify': {
        method: 'POST',
        description: 'Classifies text and extracts structured information',
        body: {
          text: 'string (required)'
        },
        response: {
          zip: 'string | null',
          brand: 'string | null',
          category: 'string | null',
          time_pref: 'string | null'
        }
      },
      '/health': {
        method: 'GET',
        description: 'Service health check'
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Documentation: http://localhost:${PORT}/`);
  console.log(`🔍 Endpoint: POST http://localhost:${PORT}/classify`);
});

