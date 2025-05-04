const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

/**
 * @swagger
 * /api/resources:
 *   get:
 *     summary: Get all resources
 *     description: Retrieve a list of all resources with optional filtering and field selection
 *     parameters:
 *       - in: query
 *         name: skillSet
 *         schema:
 *           type: string
 *         description: Filter by skill set
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by role
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name
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
router.get('/', resourceController.getResources);

/**
 * @swagger
 * /api/resources/{id}:
 *   get:
 *     summary: Get a resource by ID
 *     description: Retrieve a single resource by ID with optional field selection
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Resource ID
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
 *         description: Resource not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', resourceController.getResourceById);

/**
 * @swagger
 * /api/resources:
 *   post:
 *     summary: Create a new resource
 *     description: Create a new resource with the provided data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resource'
 *     responses:
 *       201:
 *         description: Resource created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', resourceController.createResource);

/**
 * @swagger
 * /api/resources/{id}:
 *   put:
 *     summary: Update a resource
 *     description: Update an existing resource with the provided data
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Resource ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resource'
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', resourceController.updateResource);

/**
 * @swagger
 * /api/resources/{id}:
 *   delete:
 *     summary: Delete a resource
 *     description: Delete a resource by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', resourceController.deleteResource);

module.exports = router; 