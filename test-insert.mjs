import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    const { data, error } = await supabase.from('payment_accounts').insert([
        { type: 'usdt', label: 'Test USDT', account_number: '123T', is_active: true }
    ]).select();

    console.log("Insert Result:", data);
    console.log("Insert Error:", error);

    if (data && data.length > 0) {
        await supabase.from('payment_accounts').delete().eq('id', data[0].id);
    }
}
run();
