import express, { Request, Response } from 'express';
import { Order } from '../models/Order';
import sqlite3 from 'sqlite3';
import { sendMessage } from './kafka-module';
import { AuthChecker } from '../services/authchecker';

const router = express.Router();
const jsonParser = express.json();

// Establish a connection to the SQLite database
const db = new sqlite3.Database('sqlite.db');

// Create an "orders" table if it doesn't exist
db.run(
  'CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, productName TEXT, pstatus Text, quantity INTEGER)',
  (error) => {
    if (error) {
      console.error('Error creating orders table:', error);
    } else {
      console.log('Orders table created or already exists.');
    }
  }
);

// Get all orders
router.get('/orders', (req: Request, res: Response) => {
  db.all('SELECT * FROM orders', (error, rows: Order[]) => {
    if (error) {
      console.error('Error getting orders:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
});

// Create a new order
router.post('/orders', (req: Request, res: Response) => {
  const { productName, pstatus, quantity } = req.body;
  const sql = 'INSERT INTO orders (productName, pstatus, quantity) VALUES (?, ?, ?)';
  const values = [productName, pstatus, quantity];

  db.run(sql, values, function(error) {
    if (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const newOrder: Order = {
        id: this.lastID,
        productName,
        pstatus,
        quantity,
      };

      //sendMessage(order)
      res.status(201).json(newOrder);
    }
  });


});

// The rest of your code remains the same
router.get('/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id);

  if (isNaN(orderId) || orderId <= 0) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  const sql = 'SELECT * FROM orders WHERE id = ?';
  const values = [orderId];

  db.get(sql, values, (error, order) => {
    if (error) {
      console.error('Error getting order:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    sendMessage(order)
    // Ensure the producer is ready before producing the message

    res.json(order);
  });
});

router.put('/orders/:id', jsonParser, (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);
  const newStatus = req.body.status;

  if (isNaN(orderId) || orderId <= 0) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  if (!newStatus || newStatus !== 'closed') {
    return res.status(400).json({ error: 'Invalid status value. Status should be "closed".' });
  }

  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  const values = [newStatus, orderId];

  db.run(sql, values, (error) => {
    if (error) {
      console.error('Error updating order status:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ message: 'Order status updated to "closed"' });
  });
});

router.get('/auth', jsonParser, async (req: Request, res: Response) => {
  //const orderId = parseInt(req.params.id);
  const newStatus = req.body.status;
  const accessToken = req.header('Authorization');

  // Check if the Bearer token is provided
  if (!accessToken || !accessToken.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Remove 'Bearer ' prefix to get the token
  const token = accessToken.slice(7);

  // Check user authentication using the provided token
  try {
    const authResponse = await AuthChecker(token);
    console.log("authResponse", authResponse)
    //if (authResponse && authResponse.isAuthenticated) {
    //// User is authenticated, proceed to update the order status
    //if (!newStatus || newStatus !== 'closed' || newStatus !== 'open') {
    //return res.status(400).json({ error: 'Invalid status value.' });
    //}
    //} else {
    //// User is not authenticated
    //return res.status(401).json({ error: 'Unauthorized' });
    //}
  } catch (error) {
    console.error('Error calling AuthChecker:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



export default router;

