import express, { Request as ExpressRequest, Response, NextFunction } from 'express';

interface OrderDTO {
  productName: string;
  pstatus: string;
  quantity: number;
  price: number;
}

// Define a custom Request interface
interface CustomRequest extends ExpressRequest {
  user?: any; // Modify this according to the actual user type
}
export { OrderDTO, CustomRequest };

