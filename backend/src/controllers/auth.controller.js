import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async registerPatient(req, res, next) {
    try {
      const result = await AuthService.registerPatient(req.body);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async registerDoctor(req, res, next) {
    try {
      const result = await AuthService.registerDoctor(req.body);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async registerLaboratory(req, res, next) {
    try {
      const result = await AuthService.registerLaboratory(req.body);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      const result = await AuthService.resetPassword(token, newPassword);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async getCurrentUser(req, res, next) {
    try {
      res.json({ success: true, user: req.user });
    } catch (err) {
      next(err);
    }
  }
}
