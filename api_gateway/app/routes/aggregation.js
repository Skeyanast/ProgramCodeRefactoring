const express = require('express');
const router = express.Router();
const aggregationService = require('../services/aggregationService');

// GET /users/:userId/details - получить пользователя с его заказами
router.get('/users/:userId/details', async (req, res) => {
    try {
        const result = await aggregationService.getUserDetailsWithOrders(req.params.userId);
        
        if (result.error === 'User not found') {
            return res.status(404).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /users/:userId/details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;