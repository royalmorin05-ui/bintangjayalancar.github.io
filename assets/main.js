const slider = document.querySelector('.slider');
    const dots = document.querySelectorAll('.slider-nav a');
    const slides = document.querySelectorAll('.slider img');
    let currentIndex = 0;
    let slideInterval;
    const intervalTime = 5000; // Waktu ganti gambar (5 detik)

    function updateSlider(index) {
      currentIndex = index;
      
      // 1. Scroll ke slide yang dituju
      const slideWidth = slides[0].clientWidth;
      slider.scrollTo({
        left: slideWidth * currentIndex,
        behavior: 'smooth'
      });

      // 2. Update kelas aktif pada dots
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function nextSlide() {
      let nextIndex = (currentIndex + 1) % slides.length;
      updateSlider(nextIndex);
    }

    function startInterval() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, intervalTime);
    }

    // Event listener untuk klik manual pada dots
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault(); // Mencegah jump hulu default anchor URL
        updateSlider(idx);
        startInterval(); // Reset ulang timer ketika diklik manual
      });
    });

    // Inisialisasi awal
    updateSlider(0);
    startInterval();

    // Opsional: Update dot jika user melakukan scroll manual dengan swipe
    let isScrolling;
    slider.addEventListener('scroll', () => {
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        const slideWidth = slides[0].clientWidth;
        const newIndex = Math.round(slider.scrollLeft / slideWidth);
        if (newIndex !== currentIndex && newIndex < slides.length) {
          updateSlider(newIndex);
          startInterval();
        }
      }, 100);
    });