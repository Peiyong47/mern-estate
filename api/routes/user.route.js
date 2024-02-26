import express from 'express';
import { deleteUser, test, updateUser, getUserListings } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// req: data get from client side (which is from browser)
// res: data get from server side 
router.get('/test', test);
// neet to get the id from the client side so we can know we are updating the correct user
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);


export default router;