(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#site-nav');
  const navLinks = document.querySelectorAll('#site-nav a');
  const revealEls = document.querySelectorAll('.reveal');
  const timeline = document.querySelector('.timeline');
  const timelineEntries = document.querySelectorAll('.timeline-entry');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open');
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Progressive reveal supports visual scanning without adding heavy animation.
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });

  if (timeline && timelineEntries.length > 0) {
    const setActiveTimelineEntry = function (activeIndex) {
      const progress = ((activeIndex + 1) / timelineEntries.length) * 100;
      timeline.style.setProperty('--tracker-progress', progress + '%');
    };

    timelineEntries.forEach(function (entry, index) {
      entry.setAttribute('data-timeline-index', String(index));
    });

    const updateTimelineByScroll = function () {
      const viewportFocus = window.innerHeight * 0.42;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      timelineEntries.forEach(function (entry, index) {
        const rect = entry.getBoundingClientRect();
        const entryAnchor = rect.top + rect.height * 0.35;
        const distance = Math.abs(entryAnchor - viewportFocus);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveTimelineEntry(closestIndex);
    };

    updateTimelineByScroll();
    window.addEventListener('scroll', updateTimelineByScroll, { passive: true });
    window.addEventListener('resize', updateTimelineByScroll);
  }

  const carousels = document.querySelectorAll('[data-carousel]');

  carousels.forEach(function (carousel) {
    const track = carousel.querySelector('[data-carousel-track]');
    const slides = carousel.querySelectorAll('.fgc-slide');
    const dots = carousel.querySelectorAll('[data-slide-to]');
    const prevButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');

    if (!track || slides.length === 0) {
      return;
    }

    let currentIndex = 0;
    let autoPlayId = null;

    const renderSlide = function (index) {
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === currentIndex);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === currentIndex);
      });
    };

    const startAutoPlay = function () {
      if (autoPlayId) {
        return;
      }

      autoPlayId = window.setInterval(function () {
        renderSlide(currentIndex + 1);
      }, 4200);
    };

    const stopAutoPlay = function () {
      if (!autoPlayId) {
        return;
      }

      window.clearInterval(autoPlayId);
      autoPlayId = null;
    };

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        renderSlide(currentIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        renderSlide(currentIndex + 1);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const targetIndex = Number(dot.getAttribute('data-slide-to'));
        if (!Number.isNaN(targetIndex)) {
          renderSlide(targetIndex);
        }
      });
    });

    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    carousel.addEventListener('focusin', stopAutoPlay);
    carousel.addEventListener('focusout', startAutoPlay);

    carousel.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        renderSlide(currentIndex - 1);
      }

      if (event.key === 'ArrowRight') {
        renderSlide(currentIndex + 1);
      }
    });

    renderSlide(0);
    startAutoPlay();
  });
})();
