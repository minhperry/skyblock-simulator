import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hypixel API Proxy',
      version: '1.0.0',
      description: 'A proxy for the Hypixel API, specifically for this website.',
    }
  },
  apis: ['./server/hypixelApi/**/*.ts'],
})