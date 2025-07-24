import { Router } from 'express';

const router = Router();

router.get('/', (req: any, res: any) => {
  res.json({ message: 'Achievements endpoint - to be implemented' });
});

export default router;
