const express = require('express');
const router = express.Router();
const { usersCircuit, ordersCircuit } = require('../circuits/breakers');

// Health check с информацией о circuit breakers
router.get('/health', (req, res) => {
    res.json({
        status: 'API Gateway is running',
        circuits: {
            users: {
                status: usersCircuit.status,
                stats: usersCircuit.stats
            },
            orders: {
                status: ordersCircuit.status,
                stats: ordersCircuit.stats
            }
        },
        timestamp: new Date().toISOString()
    });
});

// Простой статус
router.get('/status', (req, res) => {
    res.json({ status: 'API Gateway is running' });
});

module.exports = router;