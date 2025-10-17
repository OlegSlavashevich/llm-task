require('dotenv').config();
const express = require('express');
const { generateObject } = require('ai');
const { anthropic } = require('@ai-sdk/anthropic');
const { z } = require('zod');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Zod Schema for Type-Safe Structured Output
const classificationSchema = z.object({
  zip: z.string().nullable().describe("Postal code (ZIP code), if found in the text"),
  brand: z.string().nullable().describe("Brand or company name, if mentioned"),
  category: z.string().nullable().describe("Product or service category (e.g., food, electronics, clothing)"),
  time_pref: z.string().nullable().describe("Time preferences (e.g., today, tomorrow, evening, morning)")
});

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

    // Call Anthropic via AI SDK with Structured Output
    const { object } = await generateObject({
      model: anthropic('claude-4-sonnet-20250514'),
      schema: classificationSchema,
      prompt: `You are a professional information extraction specialist. Your task is to analyze text and extract specific structured data with high accuracy.

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
- Handle abbreviations and colloquial terms appropriately

TEXT TO ANALYZE: ${text}`,
      temperature: 0.3,
    });

    // Return result (guaranteed type-safe thanks to Zod schema)
    res.json(object);

  } catch (error) {
    console.error('Error processing request:', error);
    
    // Handle different error types
    if (error.name === 'AI_APICallError') {
      if (error.statusCode === 401) {
        return res.status(401).json({
          error: 'Invalid Anthropic API key'
        });
      }
      if (error.statusCode === 429) {
        return res.status(429).json({
          error: 'Rate limit exceeded'
        });
      }
    }

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return res.status(500).json({
        error: 'Schema validation failed',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
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

