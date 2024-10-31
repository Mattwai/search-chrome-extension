import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { SUPPORTED_SERVICES } from '../config/services';

export const authController = {
  async initiateAuth(req: Request, res: Response) {
    const { service } = req.params;
    const serviceConfig = SUPPORTED_SERVICES[service.toUpperCase() as keyof typeof SUPPORTED_SERVICES];
    
    if (!serviceConfig) {
      res.status(400).json({ success: false, error: 'Service not supported' });
      return;
    }

    const authUrl = serviceConfig.authUrl;
    res.json({ success: true, authUrl });
  },

  async handleCallback(req: Request, res: Response) {
    const { service, code, state } = req.query;
    
    try {
      const token = await AuthService.handleAuthCallback(
        service as string,
        code as string,
        state as string
      );
      
      res.json({ success: true, token });
    } catch (error) {
      console.error('Auth callback error:', error);
      res.status(500).json({ success: false, error: 'Authentication failed' });
    }
  },

  async getToken(req: Request, res: Response) {
    const { service } = req.params;
    
    try {
      const token = await AuthService.getServiceToken(service);
      if (!token) {
        res.status(404).json({ success: false, error: 'Token not found' });
        return;
      }
      
      res.json({ success: true, token });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to get token' });
    }
  }
};
