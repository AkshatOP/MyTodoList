import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import todoRoutes from './routes/todo.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorMiddleware.js'

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
const mongodb_URL = process.env.MONGO_URI;

app.use(cors({
  origin: ["http://127.0.0.1:3001","http://localhost:3001"], //Currently on local host but change according to your frontend 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  credentials: true 
}));
app.use(express.json());


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin",  "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
      return res.sendStatus(200);
  }
  next();
});


app.use("/api/auth", authRoutes);
app.use('/api/todo', todoRoutes);


mongoose.connect(`${mongodb_URL}`)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));


app.get('/', function (req, res) {
  res.send('go to /api/todo !');
});

app.use(errorHandler); //error handler


app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}`)
});