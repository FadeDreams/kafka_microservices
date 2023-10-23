import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'; // Import Prisma Client
import { sendMessage } from './kafka-module';
import { OrderDTO } from '../dto/orderdto';

const router = express.Router();
const jsonParser = express.json();

const prisma = new PrismaClient(); // Create a Prisma Client instance

// Get all orders
router.get('/orders', async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany();
  res.json(orders);
});

// Create a new order
router.post('/orders', async (req: Request, res: Response) => {
  const { productName, pstatus, quantity, price } = req.body as OrderDTO;
  const newOrder = await prisma.order.create({
    data: {
      productName,
      pstatus,
      quantity,
      price
    },
  });

  sendMessage(newOrder);
  res.status(201).json(newOrder);
});

// Get an order by its ID
router.get('/orders/:id', async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);

  try {
    // Use Prisma to fetch the order by ID
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error getting order by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a product by its ID
router.put('/orders/:id', async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);

  const { pstatus } = req.body; // You want to update the "pstatus" field

  try {
    // Use Prisma to update the order by ID
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        pstatus,
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


prisma.$disconnect();

export default router;

