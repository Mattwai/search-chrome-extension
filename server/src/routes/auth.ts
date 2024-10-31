import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

router.get('/:service/authorize', authController.initiateAuth);
router.get('/:service/callback', authController.handleCallback);
router.get('/:service/token', authController.getToken);

export default router; 