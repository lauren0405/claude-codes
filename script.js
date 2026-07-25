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