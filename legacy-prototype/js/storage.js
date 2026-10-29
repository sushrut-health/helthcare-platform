/**
 * LocalStorage demonstration wrapper for Sushrut Health
 */
const STORAGE_KEY = 'sushrut_demo_store';

const Storage = {
  getStore() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn("Could not read from LocalStorage", e);
    }
    return null;
  },

  initStore() {
    let store = this.getStore();
    if (!store && window.DEMO_DATA) {
      store = JSON.parse(JSON.stringify(window.DEMO_DATA));
      this.saveStore(store);
    }
    return store;
  },

  saveStore(store) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      console.error("Could not write to LocalStorage", e);
    }
  },

  resetStore() {
    if (window.DEMO_DATA) {
      const fresh = JSON.parse(JSON.stringify(window.DEMO_DATA));
      this.saveStore(fresh);
      return fresh;
    }
    return null;
  },

  get(key) {
    const store = this.initStore();
    return store ? store[key] : null;
  },

  set(key, val) {
    const store = this.initStore() || {};
    store[key] = val;
    this.saveStore(store);
  },

  addItem(key, item) {
    const store = this.initStore() || {};
    if (!Array.isArray(store[key])) {
      store[key] = [];
    }
    store[key].unshift(item);
    this.saveStore(store);
  },

  updateItem(key, idField, idVal, updateFields) {
    const store = this.initStore() || {};
    if (Array.isArray(store[key])) {
      const idx = store[key].findIndex(i => i[idField] === idVal);
      if (idx !== -1) {
        store[key][idx] = { ...store[key][idx], ...updateFields };
        this.saveStore(store);
        return true;
      }
    }
    return false;
  }
};

window.Storage = Storage;
// Initialize immediately
Storage.initStore();
