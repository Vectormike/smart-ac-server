import { Router } from 'express';
import { deviceRouter } from './components/device';

const router = Router();

router.get('/', (req, res) => {
  return res.status(200).send({
    message: 'Live 🙂',
  });
});

router.use('/api', deviceRouter);

export default router;
