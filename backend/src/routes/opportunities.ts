import { Router } from 'express';

const router = Router();

router.get('/', (req: any, res: any) => {
  // Return empty array for now - will be implemented with actual data later
  res.json([]);
});

router.post('/', (req: any, res: any) => {
  res.json({ message: 'Create opportunity - to be implemented' });
});

export default router;
