import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import userRoutes from "./routers/userRoutes";
import modelRoutes from "./routers/modelRoutes";

dotenv.config();

const app = express();
const router = express.Router();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(router);

userRoutes(router);
modelRoutes(router);
    
app.get('/api', (req, res) => {
    res.send("Hello World! This is Moopi Server.")
});

http.createServer(app).listen(5001, () => {
    console.log('Server started at http://localhost:5001');
});

