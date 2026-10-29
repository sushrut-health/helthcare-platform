/**
 * Shared validation and form helper
 */
const Forms = {
  showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>ℹ️</span> <div>${message}</div>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  validateRequired(formElement) {
    const inputs = formElement.querySelectorAll('[required]');
    let isValid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = 'var(--error)';
        isValid = false;
      } else {
        input.style.borderColor = 'var(--border)';
      }
    });
    return isValid;
  }
};

window.Forms = Forms;
