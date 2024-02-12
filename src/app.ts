import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import httpStatus from 'http-status';
import router from './app/router';
import cookieParser from 'cookie-parser';
const app: Application = express();

// cors
app.use(cors());

// middleware/parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Application routes
app.use('/api/v1', router);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send({ message: '🔥 Application is successfully running 🔥' });
});

// global error handler
app.use(globalErrorHandler);

// Handle not found
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API not found',
      },
    ],
  });
});

export default app;
