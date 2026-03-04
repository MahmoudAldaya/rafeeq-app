const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    try {
        const { data, error } = await supabase.from('payment_accounts').insert([
            { type: 'usdt', label: 'Test USDT', account_number: '123T', is_active: true }
        ]).select();
        console.log(JSON.stringify({ data, error }, null, 2));
    } catch (e) {
        console.error("Crash:", e);
    }
}
run();
