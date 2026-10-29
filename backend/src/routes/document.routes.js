import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Private Medical Document Retrieval
router.get('/:documentId', authenticate, DocumentController.getDocument);
router.get('/:documentId/metadata', authenticate, DocumentController.getDocumentMetadata);

export default router;
