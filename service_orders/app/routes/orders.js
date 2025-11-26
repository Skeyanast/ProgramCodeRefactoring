import { Router } from 'express';
const router = Router();
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder, getOrderStats, healthCheck } from '../services/orderService';

// GET /orders - получить все заказы (с фильтрацией)
router.get('/', async (req, res) => {
  try {
    const filters = {};
    
    // Поддержка фильтрации по userId и status
    if (req.query.userId) {
      filters.userId = parseInt(req.query.userId);
    }
    if (req.query.status) {
      filters.status = req.query.status;
    }

    const orders = await getAllOrders(filters);
    res.json(orders);
  } catch (error) {
    console.error('Error in GET /orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /orders/:id - получить заказ по ID
router.get('/:id', async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error in GET /orders/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /orders - создать заказ
router.post('/', async (req, res) => {
  try {
    const { user_id, product, quantity, price, status } = req.body;
    
    // Валидация обязательных полей
    if (!user_id || !product) {
      return res.status(400).json({ error: 'User ID and product are required' });
    }

    const order = await createOrder({
      userId: user_id,
      product,
      quantity,
      price,
      status
    });
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error in POST /orders:', error);
    if (error.message.includes('user does not exist')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /orders/:id - обновить заказ
router.put('/:id', async (req, res) => {
  try {
    const { user_id, product, quantity, price, status } = req.body;
    
    if (!user_id && !product && !quantity && !price && !status) {
      return res.status(400).json({ error: 'At least one field is required' });
    }

    const updates = {};
    if (user_id) updates.userId = user_id;
    if (product) updates.product = product;
    if (quantity) updates.quantity = quantity;
    if (price) updates.price = price;
    if (status) updates.status = status;

    const order = await updateOrder(req.params.id, updates);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error in PUT /orders/:id:', error);
    if (error.message.includes('user does not exist')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /orders/:id - удалить заказ
router.delete('/:id', async (req, res) => {
  try {
    const order = await deleteOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ 
      message: 'Order deleted successfully',
      deletedOrder: order 
    });
  } catch (error) {
    console.error('Error in DELETE /orders/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /orders/stats - статистика заказов
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await getOrderStats();
    res.json(stats);
  } catch (error) {
    console.error('Error in GET /orders/stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoints
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
      service: 'Orders Service',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Status endpoint (простой)
router.get('/status', (req, res) => {
  res.json({ status: 'Orders service is running' });
});

export default router;