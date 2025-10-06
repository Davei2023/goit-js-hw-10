import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

console.log('timer.js loaded');

const refs = {
  input: document.getElementById('datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerId = null;

refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  allowInput: true,   // можна вводити текстом
  clickOpens: true,   // явно відкривати по кліку
  onChange(selectedDates) {
    validateDate(selectedDates[0]);
  },
  onClose(selectedDates) {
    validateDate(selectedDates[0]);
  },
};

const fp = flatpickr(refs.input, options);

// страхувальні відкриття календаря
refs.input.addEventListener('click', () => fp && fp.open());
refs.input.addEventListener('focus', () => fp && fp.open());

function validateDate(picked) {
  if (!picked || picked.getTime() <= Date.now()) {
    userSelectedDate = null;
    refs.startBtn.disabled = true;
    // показувати тост лише якщо користувач реально щось обрав
    if (picked) {
      iziToast.error({
        title: 'Invalid date',
        message: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 2500,
      });
    }
    return;
  }
  userSelectedDate = picked;
  refs.startBtn.disabled = false;
}

refs.startBtn.addEventListener('click', onStart);

function onStart() {
  if (!userSelectedDate) return;

  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  tick(); // перший рендер
  timerId = setInterval(tick, 1000);
}

function tick() {
  const diff = userSelectedDate.getTime() - Date.now();

  if (diff <= 0) {
    clearInterval(timerId);
    timerId = null;
    updateTimerView({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    refs.input.disabled = false;       // дозволяємо вибрати нову дату
    fp.setDate(new Date(), false);     // повертаємо календар до now

    iziToast.success({
      title: 'Done',
      message: 'Countdown finished 🎉',
      position: 'topRight',
      timeout: 2500,
    });
    return;
  }

  updateTimerView(convertMs(diff));
}

function updateTimerView({ days, hours, minutes, seconds }) {
  refs.days.textContent = pad(days, 2);
  refs.hours.textContent = pad(hours, 2);
  refs.minutes.textContent = pad(minutes, 2);
  refs.seconds.textContent = pad(seconds, 2);
}

function pad(val, min = 2) {
  return String(val).padStart(min, '0');
}

// Готова утиліта з умови
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}