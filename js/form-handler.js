// Generic Form Handler
document.addEventListener("DOMContentLoaded", () => {
  const defaultWorkerSubmitUrl = "https://tran-website-api.tran-backend.workers.dev/submit";
  const endpointFromMeta = document.querySelector('meta[name="worker-submit-url"]')?.content?.trim();
  const endpointFromWindow = window.WORKER_SUBMIT_URL?.trim?.();

  const ensureToastStyles = () => {
    if (document.getElementById('tran-toast-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'tran-toast-styles';
    styles.textContent = `
      .tran-toast-root {
        position: fixed;
        right: 1rem;
        bottom: 1rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: min(26rem, calc(100vw - 2rem));
        pointer-events: none;
      }

      .tran-toast {
        pointer-events: auto;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;
        color: #ffffff;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        transform: translateY(0.5rem);
        opacity: 0;
        transition: opacity 200ms ease, transform 200ms ease;
        font-size: 0.95rem;
        line-height: 1.4;
      }

      .tran-toast.show {
        transform: translateY(0);
        opacity: 1;
      }

      .tran-toast.success {
        background: #166534;
      }

      .tran-toast.error {
        background: #b91c1c;
      }
    `;

    document.head.appendChild(styles);
  };

  const getToastRoot = () => {
    let root = document.getElementById('tran-toast-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'tran-toast-root';
      root.className = 'tran-toast-root';
      root.setAttribute('aria-live', 'polite');
      root.setAttribute('aria-atomic', 'true');
      document.body.appendChild(root);
    }
    return root;
  };

  const showToast = (message, type = 'success') => {
    ensureToastStyles();
    const root = getToastRoot();
    const toast = document.createElement('div');
    toast.className = `tran-toast ${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toast.textContent = message;

    root.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    window.setTimeout(() => {
      toast.classList.remove('show');
      window.setTimeout(() => {
        toast.remove();
      }, 220);
    }, 5000);
  };

  // Select all forms with class 'ajax-form'
  const forms = document.querySelectorAll('.ajax-form');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent default submission
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;

      submitButton.disabled = true;
      submitButton.textContent = 'Please wait...';

      try {
        const formData = new FormData(form);
        const endpoint = form.dataset.endpoint || endpointFromWindow || endpointFromMeta || defaultWorkerSubmitUrl || '/submit';
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData
        });
        const result = await response.json();

        if (result.success) {
          showToast(result.message || 'Submitted successfully.', 'success');
          form.reset();
        } else {
          showToast(result.message || 'Something went wrong.', 'error');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('Connection error. Please try again.', 'error');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }); 
  });
});