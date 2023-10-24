import express from 'express';
import { json } from 'body-parser';
import orderRoutes from './routes/orderRoutes';
import { AuthChecker } from './services/authchecker';

import dotenv from "dotenv";
import cors from "cors";
const app = express();
app.use(json());
dotenv.config();

app.use(cors()); // Apply CORS middleware before defining routes

app.use(async (req, res, next) => {
  const accessToken = req.headers.authorization?.replace('Bearer ', '');

  if (accessToken) {
    try {
      const user = await AuthChecker(accessToken);
      req.user = user; // Set the user in the request
    } catch (error) {
      // Handle authentication errors here
      console.error('Authentication error:', error);
    }
  }

  next(); // Move to the next middleware
});


app.use(orderRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

