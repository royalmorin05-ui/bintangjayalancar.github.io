require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Konfigurasi CORS (Sesuaikan origin jika ingin dibatasi)
app.use(cors());
app.use(express.json());

// Inisialisasi Supabase menggunakan Environment Variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("⚠️ ERROR: SUPABASE_URL atau SUPABASE_KEY belum terpasang di Environment Variables!");
}

const supabase = createClient(
    supabaseUrl || '', 
    supabaseKey || ''
);

// Helper function untuk handle query Supabase
const handleQuery = async (res, queryPromise, tableName) => {
    try {
        const { data, error } = await queryPromise;
        if (error) {
            console.error(`❌ Error pada tabel [${tableName}]:`, error.message);
            return res.status(500).json({ error: error.message });
        }
        return res.json(data);
    } catch (err) {
        console.error(`❌ Unexpected error pada tabel [${tableName}]:`, err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// 1. Root Route (Mencegah Error 404 saat buka domain utama)
app.get('/', (req, res) => {
    res.json({ message: "Backend API Bintang Jaya Lancar is running!" });
});

// 2. API Endpoints
app.get('/api/sliders', (req, res) => {
    handleQuery(res, supabase.from('sliders').select('*').order('id', { ascending: true }), 'sliders');
});

app.get('/api/armada', async (req, res) => {
    const { passengers, destination, category } = req.query;
    let query = supabase.from('armada').select('*');

    if (category) query = query.eq('category', category);

    try {
        const { data, error } = await query;
        if (error) {
            console.error("❌ Error pada tabel [armada]:", error.message);
            return res.status(500).json({ error: error.message });
        }
        
        let result = data || [];
        if (passengers && destination) {
            const passNum = parseInt(passengers, 10);
            result = result.filter(bus => 
                bus.max_capacity >= passNum && 
                bus.destinations && 
                bus.destinations.includes(destination)
            );
        }
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Endpoint Destinasi (Semua destinasi)
app.get('/api/destinasi', (req, res) => {
    handleQuery(res, supabase.from('destinasi').select('*').order('id', { ascending: true }), 'destinasi');
});

// Endpoint Destinasi Berdasarkan ID
app.get('/api/destinasi/:id', (req, res) => {
    const { id } = req.params;
    handleQuery(res, supabase.from('destinasi').select('*').eq('id', id).single(), 'destinasi');
});

app.get('/api/blogs', (req, res) => {
    handleQuery(res, supabase.from('blogs').select('*').order('created_at', { ascending: false }), 'blogs');
});

// Catch-all untuk route yang tidak ditemukan (Not Found)
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint tidak ditemukan!" });
});

// Menjalankan server lokal (Hanya berjalan di localhost)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server Backend berjalan di http://localhost:${PORT}`);
    });
}

// Export module untuk Vercel Serverless
module.exports = app;