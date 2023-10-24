// express.d.ts

declare module 'express-serve-static-core' {
  interface Request {
    user?: any; // Define the user property
  }
}

