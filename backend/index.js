import express from 'express';
import cors from 'cors';
import rootRouter from './routes/index.js';

// Initialize Express app
const app = express();

// Enable CORS for cross-origin requests
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Route all requests starting with /api/v1 to the rootRouter
app.use('/api/v1', rootRouter);

// Start the server and listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
