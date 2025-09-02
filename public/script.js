const menu = document.getElementById('menu');
const nav = document.querySelector('.nav');
menu?.addEventListener('click', () => {
  const open = nav?.style.display === 'flex';
  if (nav) nav.style.display = open ? 'none' : 'flex';
});

// reveal on scroll
const onScroll = () => {
  const els = document.querySelectorAll('.reveal');
  const h = window.innerHeight;
  els.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < h - 40) el.classList.add('visible');
  });
};
document.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', onScroll);

