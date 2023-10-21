import express from 'express';
import { json } from 'body-parser';
import orderRoutes from './routes/orderRoutes';

import dotenv from "dotenv";
import cors from "cors";
const app = express();
app.use(json());
dotenv.config();

app.use(cors()); // Apply CORS middleware before defining routes
app.use(orderRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

