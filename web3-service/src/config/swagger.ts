import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tresno Boedoyo Web3 API',
      version: '1.0.0',
      description: 'Web3 API for Tresno Boedoyo - Blockchain and NFT/SBT management',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://web3.ihsconnect.org'
          : `http://localhost:${process.env.PORT || 3003}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ]
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
