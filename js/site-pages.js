(() => {
  const params = new URLSearchParams(window.location.search);
  const select = document.querySelector('#partner-type');
  const reason = document.querySelector('#contact-reason');
  const setSelect = (element, value) => {
    if (!element || !value) return;
    const option = [...element.options].find((item) => item.value.toLowerCase() === value.toLowerCase() || item.text.toLowerCase() === value.toLowerCase());
    if (option) element.value = option.value;
  };
  setSelect(select, params.get('type'));
  setSelect(reason, params.get('reason'));
  document.querySelectorAll('[data-partner-type]').forEach((link) => link.addEventListener('click', () => setSelect(select, link.dataset.partnerType)));
})();
