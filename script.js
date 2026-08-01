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

  const bookingBtn = document.getElementById("booking");

bookingBtn.addEventListener("click", () => {
  Calendly.initPopupWidget({
    url: "https://calendly.com/herman121307296"
  });

  return false;
});

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