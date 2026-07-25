// Logika 1: Video Control

// URL Video Contoh (Eksterior dan Interior)
const exteriorVideoUrl = "./assets/2.mp4";
const interiorVideoUrl = "./assets/1.mp4";

// Mengambil Element DOM
const video = document.getElementById('myVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const toggleInteriorBtn = document.getElementById('toggleInteriorBtn');
const toggleIcon = document.getElementById('toggleIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let isInterior = false;

// 1. Fungsi Toggle Play / Pause
playPauseBtn.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        // Ganti class icon ke Play
        playIcon.className = 'ri-play-fill';
    } else {
        video.pause();
        // Ganti class icon ke Pause
        playIcon.className = 'ri-pause-line';
    }
});

// 2. Fungsi Toggle Interior / Eksterior Video
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
    playIcon.className = 'ri-pause-line';
});

// 3. Tombol Prev & Next (Mundur/Maju 5 detik)
prevBtn.addEventListener('click', () => {
    video.currentTime = Math.max(0, video.currentTime - 5);
});

nextBtn.addEventListener('click', () => {
    video.currentTime = Math.min(video.duration, video.currentTime + 5);
});

// Logika 2: Rekomendasi Bus
const busDatabase = [
    {
        id: 1,
        nama: "Bintang Jaya Medium Short",
        maxKapasitas: 30,
        tujuan: ["Tuban", "Yogyakarta", "Malang", "Surabaya"],
        gambar: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600",
        fasilitas: ["AC", "Reclining Seat", "USB Charger", "TV/Karaoke"],
    },
    {
        id: 2,
        nama: "Bintang Jaya Medium Long",
        maxKapasitas: 40,
        tujuan: ["Tuban", "Yogyakarta", "Bali", "Lombok", "Sumatra"],
        gambar: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=600",
        fasilitas: ["AC", "Reclining Seat", "USB Charger", "TV/Karaoke"],
    },
    {
        id: 3,
        nama: "Bintang Jaya Big Bus",
        maxKapasitas: 60,
        tujuan: ["Tuban", "Yogyakarta", "Malang", "Bali", "Jakarta", "Sumatra", "Lombok"],
        gambar: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600",
        fasilitas: ["AC", "2-2 Seat", "Reclining Seat", "Wi-Fi", "Dispenser", "USB Charger", "TV/Karaoke"],
    },
];

// 2. Amabil Element DOM
const passengerSelect = document.getElementById('passengerSelect');
const destinationSelect = document.getElementById('destinationSelect');
const searchBtn = document.getElementById('searchBtn');
const busModal = document.getElementById('busModal');
const closeModal = document.getElementById('closeModal');
const busResultContainer = document.getElementById('busResultContainer')

// 3. Logic saat Tombol Cari Diklik
searchBtn.addEventListener('click', () => {
    const selectedPassengers = parseInt(passengerSelect.value);
    const selectedDestination = destinationSelect.value;

    if (!selectedPassengers || !selectedDestination) {
        alert('Silahkan pilih jumlah penumpang dan tujuan terlebih dahulu');
        return;
    }

    const filteredBuses = busDatabase.filter(bus => {
        return bus.maxKapasitas >= selectedPassengers && bus.tujuan.includes(selectedDestination);
    });

    renderBusResult(filteredBuses);

    busModal.classList.add('active');
});

// 4. Fungsi Render Komponen Card Bus ke HTML
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

// 5. Logic Menutup Modal Popup
closeModal.addEventListener('click', () => {
    busModal.classList.remove('active');
});

// Tutup jika area luar modal diklik
window.addEventListener('click', (event) => {
    if (event.target === busModal) {
        busModal.classList.remove('active');
    }
});