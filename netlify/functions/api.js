exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { httpMethod, path, body } = event;
    const pathSegments = path.split('/').filter(Boolean);

    // Route handling
    if (httpMethod === 'GET' && pathSegments[0] === 'api' && pathSegments[1] === 'message') {
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: 'Hello from Netlify Functions API!',
          timestamp: new Date().toISOString()
        })
      };
    }

    if (httpMethod === 'POST' && pathSegments[0] === 'api' && pathSegments[1] === 'summarize') {
      const requestBody = JSON.parse(body || '{}');
      const { text } = requestBody;

      if (!text) {
        return {
          statusCode: 400,
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Text is required for summarization' })
        };
      }

      // Simple text summarization (you can integrate with OpenAI API here)
      const summary = text.length > 100 
        ? text.substring(0, 100) + '...' 
        : text;

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          summary,
          originalLength: text.length,
          summaryLength: summary.length
        })
      };
    }

    // Handle grievance submission
    if (httpMethod === 'POST' && pathSegments[0] === 'api' && pathSegments[1] === 'grievance') {
      const requestBody = JSON.parse(body || '{}');
      
      // Simulate AI categorization
      const categories = ['Very Important', 'Important', 'Normal'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const grievance = {
        id: Date.now().toString(),
        ...requestBody,
        category: randomCategory,
        status: 'Submitted',
        timestamp: new Date().toISOString()
      };

      return {
        statusCode: 201,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(grievance)
      };
    }

    // Default response for unknown routes
    return {
      statusCode: 404,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Route not found' })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
