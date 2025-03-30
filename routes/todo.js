import { Router } from 'express';
import { addTodo, toggleTodo, getTodo, deleteTodo , searchTodo } from '../controllers/todocontroller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/add', authMiddleware, addTodo); 
router.put('/:id/toggle', authMiddleware, toggleTodo); 
router.get('/', authMiddleware, getTodo);
router.delete('/:id', authMiddleware, deleteTodo);
router.get('/search', authMiddleware, searchTodo);

export default router;