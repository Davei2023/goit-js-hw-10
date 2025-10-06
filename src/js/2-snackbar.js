import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

console.log('snackbar.js loaded');

const form = document.getElementById('promise-form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const fd = new FormData(form);
  const delay = Number(fd.get('delay'));
  const state = fd.get('state');

  if (Number.isNaN(delay) || delay < 0) {
    iziToast.error({
      title: 'Invalid input',
      message: 'Delay must be a non-negative number',
      position: 'topRight',
    });
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  new Promise((resolve, reject) => {
    setTimeout(() => {
      state === 'fulfilled' ? resolve(delay) : reject(delay);
    }, delay);
  })
    .then(ms => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${ms}ms`,
        position: 'topRight',
        timeout: 3000,
      });
    })
    .catch(ms => {
      iziToast.error({
        message: `❌ Rejected promise in ${ms}ms`,
        position: 'topRight',
        timeout: 3000,
      });
    })
    .finally(() => {
      submitBtn.disabled = false;
    });
});