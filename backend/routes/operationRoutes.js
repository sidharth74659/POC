const express = require('express');
const router = express.Router();
const operationController = require('../controllers/operationController');

/**
 * @swagger
 * /api/operations:
 *   get:
 *     summary: Get all operations
 *     description: Retrieve a list of all operations with optional filtering and field selection
 *     parameters:
 *       - in: query
 *         name: resourceId
 *         schema:
 *           type: string
 *         description: Filter by resource ID
 *       - in: query
 *         name: equipment
 *         schema:
 *           type: string
 *         description: Filter by equipment
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by start date (operations starting after this date)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by end date (operations ending before this date)
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to include in the response
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/', operationController.getOperations);

/**
 * @swagger
 * /api/operations/{id}:
 *   get:
 *     summary: Get an operation by ID
 *     description: Retrieve a single operation by ID with optional field selection
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Operation ID
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to include in the response
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Operation not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', operationController.getOperationById);

/**
 * @swagger
 * /api/operations:
 *   post:
 *     summary: Create a new operation
 *     description: Create a new operation with the provided data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Operation'
 *     responses:
 *       201:
 *         description: Operation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', operationController.createOperation);

/**
 * @swagger
 * /api/operations/{id}:
 *   put:
 *     summary: Update an operation
 *     description: Update an existing operation with the provided data
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Operation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Operation'
 *     responses:
 *       200:
 *         description: Operation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Operation not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', operationController.updateOperation);

/**
 * @swagger
 * /api/operations/{id}:
 *   delete:
 *     summary: Delete an operation
 *     description: Delete an operation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Operation ID
 *     responses:
 *       200:
 *         description: Operation deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Operation not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', operationController.deleteOperation);

module.exports = router; 