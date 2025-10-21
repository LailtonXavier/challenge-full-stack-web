import { AuthController } from '@/core/auth/infra/http/controllers/auth.controller';
import { Router } from 'express';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/login', (req, res) => authController.login(req, res));
authRoutes.post('/refresh-token', (req, res) =>
  authController.refreshToken(req, res)
);

authRoutes.post('/logout', (req, res) => authController.logout(req, res));

export { authRoutes };
