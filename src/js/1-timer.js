
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

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

/** Flatpickr options */
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];

    // перевірка на минуле
    if (!picked || picked.getTime() <= Date.now()) {
      userSelectedDate = null;
      refs.startBtn.disabled = true;
      iziToast.error({
        title: 'Invalid date',
        message: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 3000,
      });
      return;
    }

    userSelectedDate = picked;
    refs.startBtn.disabled = false;
  },
};

const fp = flatpickr(refs.input, options);

refs.startBtn.addEventListener('click', onStart);

function onStart() {
  if (!userSelectedDate) return;

  // заблокуємо керування на час відліку
  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  // одразу намалюємо перший «тік»
  tick();

  timerId = setInterval(tick, 1000);
}

function tick() {
  const diff = userSelectedDate.getTime() - Date.now();

  if (diff <= 0) {
    clearInterval(timerId);
    timerId = null;
    updateTimerView({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // розблокуємо інпут для наступної дати; Start лишається неактивною
    refs.input.disabled = false;
    fp.setDate(new Date(), false);

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
  refs.days.textContent = pad(days, 2);     // дні можуть бути >2 цифр — pad просто гарантує мінімум 2
  refs.hours.textContent = pad(hours, 2);
  refs.minutes.textContent = pad(minutes, 2);
  refs.seconds.textContent = pad(seconds, 2);
}

function pad(val, min = 2) {
  return String(val).padStart(min, '0');
}

/** Готова утиліта з умови */
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
