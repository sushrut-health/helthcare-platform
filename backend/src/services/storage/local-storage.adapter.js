import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { StorageAdapter } from './storage.interface.js';

export class LocalStorageAdapter extends StorageAdapter {
  constructor(storageDir) {
    super();
    this.storageDir = path.resolve(storageDir);
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  _getSafePath(filename) {
    const safeFilename = path.basename(filename);
    const resolvedPath = path.resolve(this.storageDir, safeFilename);
    if (!resolvedPath.startsWith(this.storageDir)) {
      throw new Error('Invalid path traversal attempt');
    }
    return resolvedPath;
  }

  async storeFile(filename, buffer, mimeType = 'application/pdf') {
    const filePath = this._getSafePath(filename);
    await fs.promises.writeFile(filePath, buffer);
    const checksum = crypto.createHash('sha256').update(buffer).digest('hex');
    const stats = await fs.promises.stat(filePath);

    return {
      filename: path.basename(filename),
      storagePath: filePath,
      fileSizeBytes: stats.size,
      mimeType,
      checksumSha256: checksum
    };
  }

  async retrieveFile(filename) {
    const filePath = this._getSafePath(filename);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const buffer = await fs.promises.readFile(filePath);
    return buffer;
  }

  async deleteFile(filename) {
    const filePath = this._getSafePath(filename);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }

  async fileExists(filename) {
    const filePath = this._getSafePath(filename);
    return fs.existsSync(filePath);
  }

  async getMetadata(filename) {
    const filePath = this._getSafePath(filename);
    if (!fs.existsSync(filePath)) return null;
    const stats = await fs.promises.stat(filePath);
    return {
      filename: path.basename(filename),
      size: stats.size,
      createdAt: stats.birthtime,
      updatedAt: stats.mtime
    };
  }
}
