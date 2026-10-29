import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { db } from '../repositories/db.repository.js';

const router = Router();

router.use(authenticate);

// Get current user's notifications
router.get('/', (req, res, next) => {
  try {
    const store = db.store;
    const list = store.notifications
      .filter(n => n.user_id === req.user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json({ success: true, notifications: list });
  } catch (err) {
    next(err);
  }
});

// Mark notification as read
router.patch('/:id/read', (req, res, next) => {
  try {
    const store = db.store;
    const notif = store.notifications.find(n => n.id === req.params.id && n.user_id === req.user.id);
    if (notif) {
      notif.is_read = true;
    }
    res.json({ success: true, notification: notif });
  } catch (err) {
    next(err);
  }
});

export default router;
