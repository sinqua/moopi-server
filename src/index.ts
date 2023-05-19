import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import userRoutes from "./routers/userRoutes";

dotenv.config();

const app = express();
const router = express.Router();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(router);

userRoutes(router);

app.get('/api', (req, res) => {
    res.send('Hello World!');
});

http.createServer(app).listen(5001, () => {
    console.log('Server started at http://localhost:5001');
});