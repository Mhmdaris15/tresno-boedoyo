import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tresno Boedoyo API',
      version: '1.0.0',
      description: 'API documentation for Indonesia Heritage Society Connect platform',
      contact: {
        name: 'Tresno Boedoyo Team',
        email: 'support@ihsconnect.org'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.ihsconnect.org'
          : `http://localhost:${process.env.PORT || 3001}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // paths to files containing OpenAPI definitions
};

export const swaggerSpec = swaggerJSDoc(options);
