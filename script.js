const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  function getScrollStep(){
    const item = track.querySelector('.block--5-item');
    if(!item) return 164;
    const gap = 14;
    return item.offsetWidth + gap;
  }

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
  });

/*const bookingBtn = document.getElementById("booking");

bookingBtn.addEventListener("click", () => {
  Calendly.initPopupWidget({
    url: "https://calendly.com/herman121307296"
  });

  return false;
});
*/

const hero = document.querySelector(".hero");
const funcBar = document.querySelector(".func-bar");

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      funcBar.classList.remove("show");
    } else {
      funcBar.classList.add("show");
    }
  },
  {
    threshold: 0.1,
  }
);

observer.observe(hero);

(function(){
  // ---------- 狀態 ----------
  var state = { date: null, time: null };
 
  var overlay      = document.getElementById('bookingOverlay');
  var ticketView    = document.getElementById('ticketView');
  var successState  = document.getElementById('successState');
  var closeBtn       = document.getElementById('bookingClose');
  var successClose   = document.getElementById('successClose');
  var timeSlotsEl     = document.getElementById('timeSlots');
  var form             = document.getElementById('bookingForm');
  var nameInput        = document.getElementById('nameInput');
  var phoneInput       = document.getElementById('phoneInput');
  var nameError        = document.getElementById('nameError');
  var phoneError       = document.getElementById('phoneError');
  var summaryDate      = document.getElementById('summaryDate');
  var summaryTime      = document.getElementById('summaryTime');
  var submitBtn        = document.getElementById('submitBtn');
 
  var ALL_SLOTS = ['09:30','10:00','10:30','11:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'];
 
  // 模擬「某些時段已被預約」：用日期字串做種子，讓同一天結果固定
  function seededRandom(seed){
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  function getBookedSlots(dateStr){
    var seed = dateStr.split('').reduce(function(a,c){ return a + c.charCodeAt(0); }, 0);
    return ALL_SLOTS.filter(function(_, i){ return seededRandom(seed + i) < 0.28; });
  }
 
  // ---------- 初始化 Flatpickr（行內日曆） ----------
  var fp = flatpickr('#flatpickrCalendar', {
    inline: true,
    locale: 'zh',
    minDate: 'today',
    maxDate: new Date().fp_incr(60), // 開放未來 60 天
    disable: [ function(date){ return date.getDay() === 0; } ], // 週日公休（示範）
    onChange: function(selectedDates, dateStr){
      state.date = dateStr;
      state.time = null;
      renderTimeSlots(dateStr);
      updateSummary();
    }
  });
 
  // ---------- 時段渲染 ----------
  function renderTimeSlots(dateStr){
    var booked = getBookedSlots(dateStr);
    timeSlotsEl.innerHTML = '';
    ALL_SLOTS.forEach(function(slot){
      var isBooked = booked.indexOf(slot) !== -1;
      var chip = document.createElement('div');
      chip.className = 'time-chip' + (isBooked ? ' disabled' : '');
      chip.textContent = slot;
      if (!isBooked){
        chip.addEventListener('click', function(){ selectTime(slot, chip); });
      }
      timeSlotsEl.appendChild(chip);
    });
  }
 
  function selectTime(slot, chipEl){
    state.time = slot;
    Array.prototype.forEach.call(timeSlotsEl.children, function(el){ el.classList.remove('selected'); });
    chipEl.classList.add('selected');
    updateSummary();
  }
 
  function updateSummary(){
    summaryDate.textContent = state.date ? state.date : '— 尚未選擇日期 —';
    summaryTime.textContent = state.time ? state.time : '—';
  }
 
  // ---------- 表單驗證 ----------
  function validatePhone(v){
    // 接受 09xxxxxxxx 或 09xx-xxx-xxx 等常見台灣手機格式
    return /^09\d{2}-?\d{3}-?\d{3}$/.test(v.trim());
  }
 
  function setFieldError(input, errorEl, message){
    if (message){
      input.classList.add('invalid');
      errorEl.textContent = message;
    } else {
      input.classList.remove('invalid');
      errorEl.textContent = '';
    }
  }
 
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var valid = true;
 
    if (!nameInput.value.trim()){
      setFieldError(nameInput, nameError, '請輸入姓名');
      valid = false;
    } else {
      setFieldError(nameInput, nameError, '');
    }
 
    if (!validatePhone(phoneInput.value)){
      setFieldError(phoneInput, phoneError, '請輸入正確的手機號碼格式，例如 0912-345-678');
      valid = false;
    } else {
      setFieldError(phoneInput, phoneError, '');
    }
 
    if (!state.date || !state.time){
      valid = false;
      submitBtn.classList.remove('shake');
      void submitBtn.offsetWidth; // 重新觸發動畫
      submitBtn.classList.add('shake');
      submitBtn.textContent = '請選擇日期與時段';
      setTimeout(function(){ submitBtn.textContent = '確認預約'; }, 1600);
    }
 
    if (!valid) return;
 
    showSuccess();
  });
 
  function showSuccess(){
    var code = 'BK' + Date.now().toString().slice(-6);
    document.getElementById('resCode').textContent = code;
    document.getElementById('resDate').textContent = state.date;
    document.getElementById('resTime').textContent = state.time;
    document.getElementById('resName').textContent = nameInput.value.trim();
    document.getElementById('resPhone').textContent = phoneInput.value.trim();
 
    ticketView.hidden = true;
    successState.hidden = false;
 
    // 這裡是實際串接後端的位置，例如：
    // fetch('/api/bookings', { method:'POST', body: JSON.stringify({date: state.date, time: state.time, name: nameInput.value, phone: phoneInput.value}) })
  }
 
  // ---------- 開關視窗 ----------
  function openModal(){
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
 
  function closeModal(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
 
  function resetForm(){
    state = { date: null, time: null };
    fp.clear();
    nameInput.value = '';
    phoneInput.value = '';
    setFieldError(nameInput, nameError, '');
    setFieldError(phoneInput, phoneError, '');
    updateSummary();
    timeSlotsEl.innerHTML = '<div class="time-empty">請先選擇日期</div>';
    ticketView.hidden = false;
    successState.hidden = true;
  }
 
  document.querySelectorAll('[data-booking-open]').forEach(function(btn){
    btn.addEventListener('click', openModal);
  });
 
  closeBtn.addEventListener('click', closeModal);
  successClose.addEventListener('click', function(){ closeModal(); resetForm(); });
 
  overlay.addEventListener('click', function(e){
    if (e.target === overlay) closeModal();
  });
 
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
})();