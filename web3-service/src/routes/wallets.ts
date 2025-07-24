import { Router } from 'express';

const router = Router();

router.post('/create', (req: any, res: any) => {
  res.json({ message: 'Create wallet endpoint - to be implemented' });
});

export default router;
