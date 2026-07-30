require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());


console.log("--- PERIKSA KONEKSI BACKEND ---");
console.log("SUPABASE_URL :", process.env.SUPABASE_URL ? "✅ Terbaca" : "❌ TIDAK TERBACA / KOSONG!");
console.log("SUPABASE_KEY :", process.env.SUPABASE_KEY ? "✅ Terbaca" : "❌ TIDAK TERBACA / KOSONG!");
console.log("--------------------------------");

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.error("⚠️ ERROR: Isi file .env kamu belum terbaca! Pastikan file bernama '.env' dan berada dalam folder yang sama dengan server.js");
}

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://mvhgkqnotdirhgbefnlj.supabase.co', 
    process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGdrcW5vdGRpcmhnYmVmbmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MDY5NzUsImV4cCI6MjEwMDk4Mjk3NX0.8obC1vRAK6V_9_D5ZwbzuxW9Tl4OxstrKf4Me3xQD4Y'
);


const handleQuery = async (res, queryPromise, tableName) => {
    const { data, error } = await queryPromise;
    if (error) {
        console.error(`❌ Error pada tabel [${tableName}]:`, error.message);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
};


app.get('/api/sliders', (req, res) => {
    handleQuery(res, supabase.from('sliders').select('*').order('id', { ascending: true }), 'sliders');
});

app.get('/api/armada', (req, res) => {
    const { passengers, destination, category } = req.query;
    let query = supabase.from('armada').select('*');

    if (category) query = query.eq('category', category);

    query.then(({ data, error }) => {
        if (error) {
            console.error("❌ Error pada tabel [armada]:", error.message);
            return res.status(500).json({ error: error.message });
        }
        let result = data || [];
        if (passengers && destination) {
            result = result.filter(bus => 
                bus.max_capacity >= parseInt(passengers) && 
                bus.destinations && bus.destinations.includes(destination)
            );
        }
        res.json(result);
    });
});

app.get('/api/destinasi', (req, res) => {
    handleQuery(res, supabase.from('destinasi').select('*').order('id', { ascending: true }), 'destinasi');
});

app.get('/api/blogs', (req, res) => {
    handleQuery(res, supabase.from('blogs').select('*').order('created_at', { ascending: false }), 'blogs');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server Backend berjalan di http://localhost:${PORT}`);
});