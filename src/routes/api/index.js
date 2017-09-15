import { Router } from 'express';
import logger from '../../utils/logger';

import Books from './books';

const router = Router();

router.get('/', (req, res) => res.send('api'));

router.use('/books', Books);

// error handling
router.use((err, req, res, next) => {
  logger.error('/api -', err);
  res.status(500);
  res.json({
    Error: err.message,
  });
  next();
});
export default router;
