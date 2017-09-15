import { Router } from 'express';
import Api from './api';
import Hello from './hello';

const router = Router();

router.use('/hello', Hello);
router.use('/api', Api);

export default router;
