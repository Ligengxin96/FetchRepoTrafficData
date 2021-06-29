import express from 'express';

import { getTrafficData } from '../controllers/trafficData.js';

const router = express.Router();

router.get('/:repo', getTrafficData);
router.get('/:repo/:days', getTrafficData);


export default router;