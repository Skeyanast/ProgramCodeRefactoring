import { Router } from 'express';
const router = Router();
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, healthCheck } from '../services/userService';

// GET /users - получить всех пользователей
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error in GET /users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /users/:id - получить пользователя по ID
router.get('/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in GET /users/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /users - создать пользователя
router.post('/', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    // Базовая валидация
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const user = await createUser({ email, name });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error in POST /users:', error);
    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /users/:id - обновить пользователя
router.put('/:id', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email && !name) {
      return res.status(400).json({ error: 'At least one field (email or name) is required' });
    }

    const updates = {};
    if (email) updates.email = email;
    if (name) updates.name = name;

    const user = await updateUser(req.params.id, updates);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error in PUT /users/:id:', error);
    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /users/:id - удалить пользователя
router.delete('/:id', async (req, res) => {
  try {
    const user = await deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      message: 'User deleted successfully',
      deletedUser: user 
    });
  } catch (error) {
    console.error('Error in DELETE /users/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
router.get('/health/status', async (req, res) => {
  try {
    const health = await healthCheck();
    if (health.status === 'OK') {
      res.json(health);
    } else {
      res.status(503).json(health);
    }
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      service: 'Users Service',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Status endpoint (простой)
router.get('/status', (req, res) => {
  res.json({ status: 'Users service is running' });
});

export default router;