// This script tests if the Swagger documentation is working correctly
const express = require('express');
const app = express();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Define a simple router with Swagger documentation
const router = express.Router();

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Test endpoint
 *     description: A simple test endpoint
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Test successful
 */
router.get('/test', (req, res) => {
  res.json({ message: 'Test successful' });
});

// Setup Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test API Documentation',
      version: '1.0.0',
      description: 'Test API documentation',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
    ],
  },
  // Look for Swagger definitions in this file
  apis: [__filename],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Setup routes
app.use('/api/test-router', router);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api/docs`);
});
