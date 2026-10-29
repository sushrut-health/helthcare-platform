import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../../config/index.js';
import { LocalStorageAdapter } from './local-storage.adapter.js';
import { S3StorageAdapter } from './s3-storage.adapter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let storageInstance = null;

export function getStorageService() {
  if (!storageInstance) {
    if (config.storage.provider === 's3' && config.storage.s3.bucket && config.storage.s3.accessKeyId) {
      storageInstance = new S3StorageAdapter(config.storage.s3);
    } else {
      // Default to Local Filesystem storage in project root storage/ directory
      const storageDir = path.resolve(__dirname, '../../../storage');
      storageInstance = new LocalStorageAdapter(storageDir);
    }
  }
  return storageInstance;
}
