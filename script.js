// ==========================================
// 1. LOGIKA SCROLL HEADER
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
// 2. LOGIKA VIDEO CONTROL HERO
// ==========================================
const exteriorVideoUrl = "./assets/2.mp4";
const interiorVideoUrl = "./assets/1.mp4";

const video = document.getElementById('myVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const toggleInteriorBtn = document.getElementById('toggleInteriorBtn');
const toggleIcon = document.getElementById('toggleIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let isInterior = false;

if (playPauseBtn && video) {
    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playIcon.className = 'ri-pause-line';
        } else {
            video.pause();
            playIcon.className = 'ri-play-fill';
        }
    });
}

if (toggleInteriorBtn && video) {
    toggleInteriorBtn.addEventListener('click', () => {
        isInterior = !isInterior;
        if (isInterior) {
            video.src = interiorVideoUrl;
            toggleInteriorBtn.setAttribute('title', 'Show Eksterior');
            toggleIcon.className = 'ri-login-box-line';
        } else {
            video.src = exteriorVideoUrl;
            toggleInteriorBtn.setAttribute('title', 'Show Interior');
            toggleIcon.className = 'ri-logout-box-r-line';
        }
        video.play();
        if (playIcon) playIcon.className = 'ri-pause-line';
    });
}

if (prevBtn && video) {
    prevBtn.addEventListener('click', () => {
        video.currentTime = Math.max(0, video.currentTime - 5);
    });
}

if (nextBtn && video) {
    nextBtn.addEventListener('click', () => {
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
    });
}

// ==========================================
// 3. LOGIKA REKOMENDASI BUS (MODAL PENCARIAN)
// ==========================================
const busDatabase = [
    {
        id: 1,
        nama: "Bintang Jaya Medium Short",
        maxKapasitas: 15,
        tujuan: ["Tuban", "Yogyakarta", "Malang", "Surabaya"],
        gambar: "./assets/dummy_card_img.jpg",
        fasilitas: ["AC", "Reclining Seat", "USB Charger", "TV/Karaoke"],
    },
    {
        id: 2,
        nama: "Bintang Jaya Medium Long",
        maxKapasitas: 30,
        tujuan: ["Tuban", "Yogyakarta", "Bali", "Lombok"],
        gambar: "./assets/dummy_card_img.jpg",
        fasilitas: ["AC", "Reclining Seat", "USB Charger", "TV/Karaoke"],
    },
    {
        id: 3,
        nama: "Bintang Jaya Big Bus",
        maxKapasitas: 50,
        tujuan: ["Tuban", "Yogyakarta", "Malang", "Bali", "Jakarta"],
        gambar: "./assets/dummy_card_img.jpg",
        fasilitas: ["AC", "2-2 Seat", "Reclining Seat", "Dispenser", "USB Charger", "TV/Karaoke"],
    },
];

const passengerSelect = document.getElementById('passengerSelect');
const destinationSelect = document.getElementById('destinationSelect');
const searchBtn = document.getElementById('searchBtn');
const searchResultModal = document.getElementById('searchResultModal');
const closeSearchModal = document.getElementById('closeSearchModal');
const busResultContainer = document.getElementById('busResultContainer');

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const selectedPassengers = parseInt(passengerSelect.value);
        const selectedDestination = destinationSelect.value;

        if (!selectedPassengers || !selectedDestination) {
            alert('Silakan pilih jumlah penumpang dan tujuan terlebih dahulu!');
            return;
        }

        const filteredBuses = busDatabase.filter(bus => {
            return bus.maxKapasitas >= selectedPassengers && bus.tujuan.includes(selectedDestination);
        });

        renderBusResult(filteredBuses);
        if (searchResultModal) searchResultModal.classList.add('active');
    });
}

function renderBusResult(buses) {
    busResultContainer.innerHTML = '';

    if (buses.length === 0) {
        busResultContainer.innerHTML = `
        <div class="no-result">
            <i class="ri-bus-2-line" style="font-size: 40px; color: #ccc;"></i>
            <p>Maaf, tidak ada bus yang sesuai dengan kriteria pencarian Anda.</p>
        </div>
        `;
        return;
    }

    buses.forEach(bus => {
        const fasilitasHTML = bus.fasilitas.map(f =>
            `<span class="facility-tag"><i class="ri-checkbox-circle-fill"></i> ${f}</span>`
        ).join('');

        const busCardHTML = `
          <div class="bus-card">
            <img src="${bus.gambar}" alt="${bus.nama}" class="bus-image">
            <div class="bus-info">
              <h4 class="bus-name">${bus.nama}</h4>
              <p class="bus-capacity"><i class="ri-user-line"></i> Maksimal ${bus.maxKapasitas} Penumpang</p>
              
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
// 4. LOGIKA TAB FILTER & MODAL DETAIL ARMADA
// ==========================================
function filterArmada(category) {
    const tabs = document.querySelectorAll('.armada_tab_btn');
    const cards = document.querySelectorAll('.card_items');

    tabs.forEach(tab => tab.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    cards.forEach(card => {
        if (card.classList.contains(category)) {
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

    const waNumber = "6281917382232"; // Ganti nomor WhatsApp asli Bintang Jaya Lancar
    const message = `Halo Admin Bintang Jaya Lancar, saya ingin bertanya ketersediaan unit armada ${code} (${type}).`;
    if (modalWaBtn) {
        modalWaBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    }

    if (armadaDetailModal) armadaDetailModal.classList.add('active');
}

function closeModal() {
    if (armadaDetailModal) armadaDetailModal.classList.remove('active');
}

// Event Listener Klik Luar Modal
window.addEventListener('click', function (event) {
    if (event.target === searchResultModal) {
        searchResultModal.classList.remove('active');
    }
    if (event.target === armadaDetailModal) {
        armadaDetailModal.classList.remove('active');
    }
});

/* ==================================================
   MOBILE MENU
   Bintang Jaya Lancar
================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.getElementById("menuToggle");
    const menu = document.getElementById("mobileMenu");

    if (!toggle || !menu) return;

    /* ===========================
       Overlay
    =========================== */

    const overlay = document.createElement("div");
    overlay.className = "mobile_overlay";
    document.body.appendChild(overlay);

    /* ===========================
       Open Menu
    =========================== */

    function openMenu() {
        menu.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";

        toggle.innerHTML =
            '<i class="ri-close-line"></i>';
    }

    /* ===========================
       Close Menu
    =========================== */

    function closeMenu() {
        menu.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";

        toggle.innerHTML =
            '<i class="ri-menu-line"></i>';
    }

    /* ===========================
       Toggle
    =========================== */

    toggle.addEventListener("click", () => {

        if (menu.classList.contains("active")) {
            closeMenu();
        } else {
            openMenu();
        }

    });

    /* ===========================
       Klik Overlay
    =========================== */

    overlay.addEventListener("click", closeMenu);

    /* ===========================
       Klik Link Menu
    =========================== */

    const links = menu.querySelectorAll("a");

    links.forEach(link => {

        link.addEventListener("click", () => {

            if (window.innerWidth <= 992) {
                closeMenu();
            }

        });

    });

    /* ===========================
       Resize Desktop
    =========================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 992) {

            closeMenu();

        }

    });

});