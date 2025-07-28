import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
import { extractTenantId } from './middlewares/tenantExtractor';
import auth from './middlewares/auth';
import validateTenant from './middlewares/validateTenant';

// Import routes
import authRoutes from './routes/auth.routes';
import tenantRoutes from './routes/tenant.routes';
import customerRoutes from './routes/customer.routes';
import orderRoutes from './routes/order.routes';

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow all subdomains of hubnest.live
      if (
        origin.endsWith('.hubnest.live') ||
        origin === 'https://hubnest.live'
      ) {
        return callback(null, true);
      }

      // Allow localhost for development
      if (
        origin.startsWith('http://localhost:') ||
        origin.startsWith('https://localhost:')
      ) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Host'],
  }),
);

// Log every request: method, url, host
app.use((req: Request, res: Response, next: NextFunction) => {
  console.info(
    `[REQ] ${req.method} ${req.originalUrl} Host: ${req.headers.host}`,
  );
  next();
});

// Serve static frontend files
// Order matters here, static files must come before catch-all
const publicPath = path.join(__dirname, '../public/browser');
console.info('Serving static files from:', publicPath);
app.use(express.static(publicPath));

// Catch-all: serve index.html for non-API routes (for Angular client-side routing)
// This is important for Angular client-side routing and should be before auth middleware,
// as one cannot use JWT for frontend routing. but only for backend routing.
app.get(/^\/(?!api\/).*/, (req: Request, res: Response) => {
  console.info('Serving index.html');
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/', (req: Request, res: Response) => {
  console.info('Serving index.html');
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use(morgan('dev'));
app.use(express.json());
app.use(extractTenantId);

// app.get('/api/test', (req: Request, res: Response) => {
//   res.json({
//     success: true,
//     message: 'GET request for testing successful',
//     tenant: req.tenant,
//   });
// });

// Public API routes (must come BEFORE static/catch-all)
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);

// Authenticated API routes
app.use(auth);
app.use(validateTenant);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

// Common error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An error occurred', error: err.message });
});

// DB connect & start
const startServer = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.info('MongoDB connected');

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.info(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
