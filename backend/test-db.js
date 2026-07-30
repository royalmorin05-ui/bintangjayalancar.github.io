require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testConnection() {
    console.log("Mencoba koneksi ke Supabase URL:", process.env.SUPABASE_URL);
    const { data, error } = await supabase.from('armada').select('*');
    
    if (error) {
        console.log("❌ Supabase menolak query:", error.message);
    } else {
        console.log("✅ KONEKSI BERHASIL! Data armada ditemukan:", data);
    }
}

testConnection();