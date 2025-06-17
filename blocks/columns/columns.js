function addInViewOnScroll() {
  const elements = document.querySelectorAll('.columns > div > div:not([class])');

  function checkInView() {
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const completelyInView = rect.top >= 0
        && rect.left >= 0
        && rect.bottom <= (window.innerHeight + 130 || document.documentElement.clientHeight + 130)
        && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
      const lowerPartTouches = rect.bottom > window.innerHeight;
      if (completelyInView) {
        el.classList.add('in-view');
        el.classList.remove('out-view');
      } else if (lowerPartTouches) {
        el.classList.remove('in-view');
        el.classList.add('out-view');
      }
    });
  }

  window.addEventListener('scroll', checkInView, { passive: true });
  window.addEventListener('resize', checkInView);
  checkInView();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(addInViewOnScroll);
  });
} else {
  requestAnimationFrame(addInViewOnScroll);
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
