import express from 'express';
import { test } from '../controllers/user.controller.js';

const router = express.Router();

// req: data get from client side (which is from browser)
// res: data get from server side 
router.get('/test', test);

export default router;