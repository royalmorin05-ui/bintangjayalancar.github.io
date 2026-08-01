// ==========================================
// CONFIGURASI BACKEND API
// ==========================================
const API_BASE_URL = '/api';

// ==========================================
// 1. LOGIKA SCROLL HEADER (BAWAAN)
// ==========================================
window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==========================================
// 2. LOGIKA SLIDER HERO (DINAMIS API + UI CONTROLS)
// ==========================================
let slides = [];
let currentSlide = 0;
let slideInterval = null;
let isPlaying = true;
const slideDelay = 4000;

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');

async function loadSliders() {
    try {
        const res = await fetch(`${API_BASE_URL}/sliders`);
        const slidersData = await res.json();
        const sliderContainer = document.querySelector('.hero_slider');

        if (slidersData.length > 0 && sliderContainer) {
            sliderContainer.innerHTML = slidersData.map((item, index) => `
                <img src="${item.image_url}" class="slide ${index === 0 ? 'active' : ''}" alt="${item.title || 'Slide'}">
            `).join('');
            
            // Re-inisialisasi elemen slide
            slides = document.querySelectorAll('.hero_slider .slide');
            startAutoSlide();
        }
    } catch (err) {
        console.error("Gagal memuat slider dari backend:", err);
    }
}

function showSlide(index) {
    if (slides.length === 0) return;
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

function nextSlide() {
    if (slides.length === 0) return;
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    if (slides.length === 0) return;
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, slideDelay);
    isPlaying = true;
    if (playIcon) playIcon.className = 'ri-pause-line';
}

function stopAutoSlide() {
    clearInterval(slideInterval);
    isPlaying = false;
    if (playIcon) playIcon.className = 'ri-play-fill';
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        if (isPlaying) { stopAutoSlide(); startAutoSlide(); }
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        if (isPlaying) { stopAutoSlide(); startAutoSlide(); }
    });
}

if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) { stopAutoSlide(); } else { startAutoSlide(); }
    });
}

// ==========================================
// 3. LOGIKA REKOMENDASI BUS / SEARCH BOX (DINAMIS API)
// ==========================================
const passengerSelect = document.getElementById('passengerSelect');
const destinationSelect = document.getElementById('destinationSelect');
const searchBtn = document.getElementById('searchBtn');
const searchResultModal = document.getElementById('searchResultModal');
const closeSearchModal = document.getElementById('closeSearchModal');
const busResultContainer = document.getElementById('busResultContainer');

if (searchBtn) {
    searchBtn.addEventListener('click', async () => {
        const selectedPassengers = passengerSelect.value;
        const selectedDestination = destinationSelect.value;

        if (!selectedPassengers || !selectedDestination) {
            alert('Silakan pilih jumlah penumpang dan tujuan terlebih dahulu!');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/armada?passengers=${selectedPassengers}&destination=${selectedDestination}`);
            const filteredBuses = await res.json();

            renderBusResult(filteredBuses);
            if (searchResultModal) searchResultModal.classList.add('active');
        } catch (err) {
            console.error("Gagal melakukan pencarian bus:", err);
        }
    });
}

function renderBusResult(buses) {
    busResultContainer.innerHTML = '';

    if (!buses || buses.length === 0) {
        busResultContainer.innerHTML = `
        <div class="no-result">
            <i class="ri-bus-2-line" style="font-size: 40px; color: #ccc;"></i>
            <p>Maaf, tidak ada bus yang sesuai dengan kriteria pencarian Anda.</p>
        </div>
        `;
        return;
    }

    buses.forEach(bus => {
        const fasilitasHTML = bus.facilities ? bus.facilities.map(f =>
            `<span class="facility-tag"><i class="ri-checkbox-circle-fill"></i> ${f}</span>`
        ).join('') : '';

        const busCardHTML = `
          <div class="bus-card">
            <img src="${bus.image_url}" alt="${bus.code}" class="bus-image">
            <div class="bus-info">
              <h4 class="bus-name">${bus.code} (${bus.type})</h4>
              <p class="bus-capacity"><i class="ri-user-line"></i> Maksimal ${bus.max_capacity} Penumpang</p>
              
              <div class="facilities-title">Fasilitas Utama:</div>
              <div class="facilities-list">
                ${fasilitasHTML}
              </div>
            </div>
          </div>
        `;

        busResultContainer.innerHTML += busCardHTML;
    });
}

if (closeSearchModal) {
    closeSearchModal.addEventListener('click', () => {
        searchResultModal.classList.remove('active');
    });
}

// ==========================================
// 4. LOGIKA ARMADA & MODAL DETAIL (DINAMIS API)
// ==========================================
async function loadArmada() {
    try {
        const res = await fetch(`${API_BASE_URL}/armada`);
        const armadaList = await res.json();
        const container = document.querySelector('.armada_card');

        if (!container) return;

        container.innerHTML = armadaList.map(item => {
            const facilitiesHTML = item.facilities ? item.facilities.map(f => 
                `<div class="facility_item"><i class="ri-checkbox-circle-line"></i> ${f}</div>`
            ).join('') : '';

            // Hapus kondisi isHidden, biarkan semua tampil secara default (untuk tab 'Lihat Semua')
            return `
            <div class="card_items ${item.category}">
                <div class="card_header">
                    <img src="${item.image_url}" alt="${item.code}">
                    <span class="badge_engine">${item.engine}</span>
                </div>
                <div class="card_body">
                    <div class="body_header">
                        <h2 class="buses_name">${item.code}</h2>
                        <p class="body_name">${item.type}</p>
                    </div>
                    <div class="body_items">
                        <h2>Fasilitas</h2>
                        <div class="facility_items_grid">
                            ${facilitiesHTML}
                        </div>
                        <div class="button_action">
                            <button onclick="openModal('${item.code}', '${item.type}', '${item.description}', '${item.image_url}')">
                                Lihat Detail
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
    } catch (err) {
        console.error("Gagal memuat armada:", err);
    }
}

function filterArmada(category) {
    const tabs = document.querySelectorAll('.armada_tab_btn');
    const cards = document.querySelectorAll('.card_items');

    tabs.forEach(tab => tab.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    cards.forEach(card => {
        if (category === 'all') {
            card.classList.remove('hide'); // Tampilkan semua
        } else if (card.classList.contains(category)) {
            card.classList.remove('hide');
        } else {
            card.classList.add('hide');
        }
    });
}

const armadaDetailModal = document.getElementById('armadaDetailModal');
const modalTitle = document.getElementById('modalTitle');
const modalSub = document.getElementById('modalSub');
const modalDesc = document.getElementById('modalDesk');
const modalImg = document.getElementById('modalImg');
const modalWaBtn = document.getElementById('modalWaBtn');

function openModal(code, type, description, imgSrc) {
    if (modalTitle) modalTitle.innerText = code;
    if (modalSub) modalSub.innerText = type;
    if (modalDesc) modalDesc.innerText = description;
    if (modalImg) modalImg.src = imgSrc;

    const waNumber = "6281112345678"; // Masukkan nomor WhatsApp asli
    const message = `Halo Admin Bintang Jaya Lancar, saya ingin bertanya ketersediaan unit armada ${code} (${type}).`;
    if (modalWaBtn) {
        modalWaBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    }

    if (armadaDetailModal) armadaDetailModal.classList.add('active');
}

function closeModal() {
    if (armadaDetailModal) armadaDetailModal.classList.remove('active');
}

window.addEventListener('click', function (event) {
    if (event.target === searchResultModal) {
        searchResultModal.classList.remove('active');
    }
    if (event.target === armadaDetailModal) {
        armadaDetailModal.classList.remove('active');
    }
});

// ==========================================
// 5. LOGIKA DESTINASI & BLOG (DINAMIS API)
// ==========================================
async function loadDestinasi() {
    try {
        const res = await fetch(`${API_BASE_URL}/destinasi`);
        const destinasiList = await res.json();
        const container = document.querySelector('.destinasi_items');

        if (!container) return;

        // Cek apakah data yang diterima benar-benar Array
        if (!Array.isArray(destinasiList)) {
            console.error("Backend mengembalikan error untuk destinasi:", destinasiList);
            return;
        }

        const cardsHTML = destinasiList.map(item => `
            <div class="destinasi_card">
                <div class="overlay_destinasi_card"></div>
                <img src="${item.image_url}" alt="${item.name}">
                <p class="destinasi_name">${item.name}</p>
            </div>
        `).join('');

        container.innerHTML = cardsHTML + `
            <div class="destinasi_button">
                <button class="btn_destinasi"><a href="../pages/semua-destinasi.html">Lihat Semua</a></button>
            </div>
        `;
    } catch (err) {
        console.error("Gagal memuat destinasi:", err);
    }
}

// Lakukan hal yang sama untuk loadBlogs()
async function loadBlogs() {
    try {
        const res = await fetch(`${API_BASE_URL}/blogs`);
        const blogList = await res.json();
        const container = document.querySelector('.update_body');

        if (!container) return;

        // Cek apakah data berupa Array
        if (!Array.isArray(blogList)) {
            console.error("Backend mengembalikan error untuk blogs:", blogList);
            return;
        }

        container.innerHTML = blogList.map(item => `
            <div class="update_card">
                <img src="${item.image_url}" alt="${item.title}">
                <a href="#" class="update_title">${item.title}</a>
                <p class="update_subtitle">${item.subtitle}</p>
            </div>
        `).join('');
    } catch (err) {
        console.error("Gagal memuat blog:", err);
    }
}

// ==========================================
// 6. MOBILE MENU & INITIAL LOAD (DOM READY)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Load Data dari API Server
    loadSliders();
    loadArmada();
    loadDestinasi();
    loadBlogs();

    // Mobile Responsive Menu Toggle
    const toggle = document.getElementById("menuToggle");
    const menu = document.getElementById("mobileMenu");

    if (!toggle || !menu) return;

    const overlay = document.createElement("div");
    overlay.className = "mobile_overlay";
    document.body.appendChild(overlay);

    function openMenu() {
        menu.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
        toggle.innerHTML = '<i class="ri-close-line"></i>';
    }

    function closeMenu() {
        menu.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
        toggle.innerHTML = '<i class="ri-menu-line"></i>';
    }

    toggle.addEventListener("click", () => {
        if (menu.classList.contains("active")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener("click", closeMenu);

    const links = menu.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 992) {
                closeMenu();
            }
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 992) {
            closeMenu();
        }
    });
});