import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import domainsRoutes from './routes/domains.js';
import topicsRoutes from './routes/topics.js';
import sessionsRoutes from './routes/sessions.js';
import spacedRepetitionRoutes from './routes/spacedRepetition.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Study Planner API is running' });
});

// API Routes
app.use('/api/domains', domainsRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/spaced-repetition', spacedRepetitionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   Study Planner API Server Running   ║
╠═══════════════════════════════════════╣
║  Port: ${PORT}                         ║
║  Environment: ${process.env.NODE_ENV || 'development'}             ║
║  Database: PostgreSQL                 ║
╚═══════════════════════════════════════╝
  `);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
