const express = require('express');
const router = express.Router();
const { ordersCircuit } = require('../circuits/breakers');

const ORDERS_SERVICE_URL = 'http://service_orders:8000';

// GET /orders/:orderId - получить заказ по ID
router.get('/:orderId', async (req, res) => {
    try {
        const order = await ordersCircuit.fire(`${ORDERS_SERVICE_URL}/orders/${req.params.orderId}`);
        if (order.error === 'Order not found') {
            res.status(404).json(order);
        } else {
            res.json(order);
        }
    } catch (error) {
        console.error('Error in GET /orders/:orderId:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /orders - создать заказ
router.post('/', async (req, res) => {
    try {
        const order = await ordersCircuit.fire(`${ORDERS_SERVICE_URL}/orders`, {
            method: 'POST',
            data: req.body
        });
        res.status(201).json(order);
    } catch (error) {
        console.error('Error in POST /orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /orders - получить все заказы
router.get('/', async (req, res) => {
    try {
        const orders = await ordersCircuit.fire(`${ORDERS_SERVICE_URL}/orders`);
        res.json(orders);
    } catch (error) {
        console.error('Error in GET /orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /orders/:orderId - обновить заказ
router.put('/:orderId', async (req, res) => {
    try {
        const order = await ordersCircuit.fire(`${ORDERS_SERVICE_URL}/orders/${req.params.orderId}`, {
            method: 'PUT',
            data: req.body
        });
        res.json(order);
    } catch (error) {
        console.error('Error in PUT /orders/:orderId:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /orders/:orderId - удалить заказ
router.delete('/:orderId', async (req, res) => {
    try {
        const result = await ordersCircuit.fire(`${ORDERS_SERVICE_URL}/orders/${req.params.orderId}`, {
            method: 'DELETE'
        });
        res.json(result);
    } catch (error) {
        console.error('Error in DELETE /orders/:orderId:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /orders/status - статус orders service
router.get('/status/health', async (req, res) => {
    try {
        const status = await ordersCircuit.fire(`${ORDERS_SERVICE_URL}/orders/health`);
        res.json(status);
    } catch (error) {
        console.error('Error in GET /orders/health:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/status/service', async (req, res) => {
    try {
        const status = await ordersCircuit.fire(`${ORDERS_SERVICE_URL}/orders/status`);
        res.json(status);
    } catch (error) {
        console.error('Error in GET /orders/status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;