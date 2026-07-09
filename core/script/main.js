// Hamburger Menu
const hamburgerTrigger = document.getElementById('hamburger_trigger');
const menuPopup = document.getElementById('menu');

hamburgerTrigger.addEventListener("click", () => {
  hamburgerTrigger.classList.toggle("active");
  menuPopup.classList.toggle("active");
})

// Images Slider
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;
let slideInterval;
const displayDuration = 5000; // 5 detik (wajib sama dengan durasi di CSS animation)

function changeSlide(nextIndex) {
    // Hapus kelas active dari slide dan dot saat ini
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    
    // Paksa reset animasi untuk span di dalam dot yang baru saja tidak aktif
    const activeSpan = dots[currentIndex].querySelector('span');
    if (activeSpan) {
        activeSpan.style.animation = 'none';
        // Trigger reflow untuk merestart animasi CSS nantinya
        void activeSpan.offsetWidth; 
        activeSpan.style.animation = null;
    }

    // Set index baru
    currentIndex = nextIndex;

    // Tambahkan kelas active ke slide dan dot yang baru
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
}

function nextSlide() {
    let nextIndex = (currentIndex + 1) % slides.length;
    changeSlide(nextIndex);
}

// Jalankan Autoplay
function startAutoplay() {
    slideInterval = setInterval(nextSlide, displayDuration);
}

// Reset Autoplay jika user klik dot manual
function resetAutoplay() {
    clearInterval(slideInterval);
    startAutoplay();
}

// Event Listener untuk Navigasi Dots (Klik Manual)
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (index === currentIndex) return; // Abaikan jika klik dot yang sedang aktif
        changeSlide(index);
        resetAutoplay();
    });
});

// Inisialisasi awal saat halaman dimuat
startAutoplay();

// Hightlight Armada
// 1. Data semua armada
const daftarArmada = [
    {
        nama: "Hiace Premio",
        gambar: "./core/assets/Toyota Hiace.png",
        fasilitas: ["18 seat", "Wifi", "Karaoke", "AC", "Bantal"]
    },
    {
        nama: "Adiputro JB5 MHD",
        gambar: "./core/assets/Adiputro_JB5_MHD.png",
        fasilitas: ["40 seat", "Wifi", "Karaoke", "AC", "Bantal", "Selimut", "Kopi"]
    },
    {
        nama: "Adiputro JB5 SDD",
        gambar: "./core/assets/Adiputro_JB5_SDD.png",
        fasilitas: ["65 seat", "Wifi", "Karaoke", "AC", "Bantal", "Selimut", "Kopi"]
    },
];

// 2. Indeks awal (armada pertama yang tampil)
let currentArmadaIndex = 0;

// 3. Ambil semua element HTML yang dibutuhkan
const armadaTitle = document.getElementById('armadaTitle');
const armadaFacilities = document.getElementById('armadaFacilities');
const armadaImg = document.getElementById('armadaImg');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// 4. Fungsi untuk memperbarui tampilan HTML berdasarkan indeks saat itu
function updateTampilanArmada(index) {
    const armada = daftarArmada[index];

    // ubah nama dan gambar
    armadaTitle.textContent = armada.nama;
    armadaImg.src = armada.gambar;
    armadaImg.alt = armada.nama;

    // Ubah list fasilital secara dinamis
    armadaFacilities.innerHTML = ""; // kosongkan fasilitas lama
    armada.fasilitas.forEach(fasilitas => {
        const span = document.createElement('span');
        span.innerHTML = `<i class="ri-check-line"></i>${fasilitas}`;
        armadaFacilities.appendChild(span);
    });
}

// 5. Event Listener untuk tombol Next (kanan)
nextBtn.addEventListener('click', () => {
    currentArmadaIndex++;
    // Jika sudah di akhir list, kembali ke awal (looping)
    if (currentArmadaIndex >= daftarArmada.length) {
        currentArmadaIndex = 0;
    }

    updateTampilanArmada(currentArmadaIndex);
});

// 6. Event Listener untuk tombol Prev (kiri)
prevBtn.addEventListener('click', () => {
    currentArmadaIndex--;
    // JIka di awal list lalu tekan prev, loncak ke kanan paling akhir
    if (currentArmadaIndex < 0) {
        currentArmadaIndex = daftarArmada.length - 1;
    }
    updateTampilanArmada(currentArmadaIndex);
});

// jalankan fungsi pertama kali agar data tersingkon saat web dimua
updateTampilanArmada(currentArmadaIndex);