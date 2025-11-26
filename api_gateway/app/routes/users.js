const express = require('express');
const router = express.Router();
const { usersCircuit } = require('../circuits/breakers');

const USERS_SERVICE_URL = 'http://service_users:8000';

// GET /users/:userId - получить пользователя по ID
router.get('/:userId', async (req, res) => {
    try {
        const user = await usersCircuit.fire(`${USERS_SERVICE_URL}/users/${req.params.userId}`);
        if (user.error === 'User not found') {
            res.status(404).json(user);
        } else {
            res.json(user);
        }
    } catch (error) {
        console.error('Error in GET /users/:userId:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /users - создать пользователя
router.post('/', async (req, res) => {
    try {
        const user = await usersCircuit.fire(`${USERS_SERVICE_URL}/users`, {
            method: 'POST',
            data: req.body
        });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error in POST /users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /users - получить всех пользователей
router.get('/', async (req, res) => {
    try {
        const users = await usersCircuit.fire(`${USERS_SERVICE_URL}/users`);
        res.json(users);
    } catch (error) {
        console.error('Error in GET /users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /users/:userId - обновить пользователя
router.put('/:userId', async (req, res) => {
    try {
        const user = await usersCircuit.fire(`${USERS_SERVICE_URL}/users/${req.params.userId}`, {
            method: 'PUT',
            data: req.body
        });
        res.json(user);
    } catch (error) {
        console.error('Error in PUT /users/:userId:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /users/:userId - удалить пользователя
router.delete('/:userId', async (req, res) => {
    try {
        const result = await usersCircuit.fire(`${USERS_SERVICE_URL}/users/${req.params.userId}`, {
            method: 'DELETE'
        });
        res.json(result);
    } catch (error) {
        console.error('Error in DELETE /users/:userId:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;