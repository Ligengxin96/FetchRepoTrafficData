import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import trafficDataRouter from './routes/trafficData.js';

dotenv.config();

const port = process.env.PORT || 5002;

const app = express();

app.use(cors());
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

app.use('/getrepoinfo/v1/getrepoinfo', trafficDataRouter);

app.listen(port, () => {
  console.log(`${new Date()}: Server running on port: ${port}`);
});


