import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import authRoutes from './routes/auth';
import searchRoutes from './routes/search';

config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CHROME_EXTENSION_ID ? 
    `chrome-extension://${process.env.CHROME_EXTENSION_ID}` : 
    'http://localhost:6900',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/search', searchRoutes);

const PORT = process.env.PORT || 6900;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
