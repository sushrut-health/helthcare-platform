/**
 * Storage Interface Specification
 * Operations:
 * - storeFile(filename, buffer, mimeType)
 * - retrieveFile(filename)
 * - deleteFile(filename)
 * - fileExists(filename)
 * - getMetadata(filename)
 */
export class StorageAdapter {
  async storeFile(filename, buffer, mimeType) {
    throw new Error('storeFile not implemented');
  }

  async retrieveFile(filename) {
    throw new Error('retrieveFile not implemented');
  }

  async deleteFile(filename) {
    throw new Error('deleteFile not implemented');
  }

  async fileExists(filename) {
    throw new Error('fileExists not implemented');
  }

  async getMetadata(filename) {
    throw new Error('getMetadata not implemented');
  }
}
