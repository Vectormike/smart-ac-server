import { Router } from 'express';
import { deviceRouter } from './components/device';
import { deviceReportRouter } from './components/deviceReport';
import { alertRouter } from './components/alert';
import { adminRouter } from './components/admin';

const router = Router();

router.get('/', (req, res) => {
  return res.status(200).send({
    message: 'Live 🙂',
  });
});

router.use('/api/admin', adminRouter);
router.use('/api', deviceRouter);
router.use('/api', deviceReportRouter);
router.use('/api', alertRouter);

export default router;
