const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Chat with AI
 *     description: Send a question to the AI with resource context
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

module.exports = router; 