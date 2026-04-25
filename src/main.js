import './config/env.config.js';
import express from "express";
import cors from 'cors'
import {envConfig , corsOptions} from './config/index.js';
import dbConnection from './DB/db.connection.js';
import { globalErrorHandler } from './Middlewares/index.js';
import * as controllers from './Modules/index.js';
import { redisConnection } from './Common/index.js';
import { getAllKeys } from './Common/services/redis/redis.service.js';
 
// Express app
const app = express();

// Port
const port = parseInt(envConfig.app.PORT || '3000');

// Database connection [ mongodb  , redis ]
dbConnection();
redisConnection();

// Global middlewares [ cors, json parser ]
app.use(cors(corsOptions)  , express.json());

//Controllers
app.use('/api/auth', controllers.authController);
app.use('/api/message', controllers.messageController);
app.use('/api/user', controllers.userController);

// test api 
app.get('/', async (req, res) => {
    const redisResult = await getAllKeys()
    res.json({message: 'Sarahah Appsssssss is running!', redisResult});
});

app.use(
    (req, res, next) => {
        res.status(404).json({ message: 'Route not found' });
    }
);

// Global error handler
app.use(globalErrorHandler);

// Server start
app.listen(port, () => {
    console.log(`Server is running on port `, port);
});

