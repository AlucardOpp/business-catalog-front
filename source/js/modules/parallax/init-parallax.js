import Rellax from './../../vendor/rellax';

const initParallax = () => {
  const header = document.querySelector('.header.header--main');

  if (!header) {
    return;
  }
  const rellax = new Rellax('.rellax');
  const breakpointTb = window.matchMedia('(max-width: 1563px)');
  const headerStaticRight = document.querySelector('.header__static-right');

  const resizeObserver = new ResizeObserver((entries, observer) => {
    for (let entry of entries) {
      if (breakpointTb.matches) {
        rellax.destroy();
        document.onscroll = () => {
          headerStaticRight.style.opacity = 1;
        };
      } else {
        rellax.refresh();
        document.onscroll = () => {
          let percent = (screen.availHeight - window.scrollY / 2) / screen.availHeight;
          if (percent <= 0) {
            headerStaticRight.style.opacity = 0;
          } else {
            headerStaticRight.style.opacity = percent;
          }
        };
      }
    }
  });

  resizeObserver.observe(header);
};

export {initParallax};
