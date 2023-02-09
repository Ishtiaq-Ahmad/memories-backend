import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js'
import dotenv from 'dotenv';

const app = express();
dotenv.config();

// may be there will be large size of image in response
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// this code allows cross-domain requests to the application
app.use(cors());
app.use('/posts', postRoutes);
app.use('/user', userRoutes)

const port = process.env.PORT || 8000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(port, () => console.log(`server running on port http://localhost:${port}`)))
    .catch((error) => console.error(error.message));

// mongoose.set('useFindAndModify', false);