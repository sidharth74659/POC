const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

/**
 * @swagger
 * /ai/chat:
 *   post:
 *     summary: Chat with AI
 *     description: Send a question to the AI with optional resource context
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatRequest'
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *       400:
 *         description: Bad request
 *       502:
 *         description: AI service unavailable
 */
router.post('/', chatController.processChat);

/**
 * @swagger
 * /ai/chat/direct:
 *   post:
 *     summary: Direct question to AI
 *     description: Send a question directly to the AI using OpenAI tools
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 description: The question to ask the AI
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *       400:
 *         description: Bad request
 *       502:
 *         description: AI service unavailable
 */
router.post('/direct', chatController.processDirectQuestion);

module.exports = router; 