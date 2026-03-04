const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

async function run() {
    const res = await fetch(`${url}/rest/v1/payment_accounts`, {
        method: 'POST',
        headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            type: 'usdt',
            label: 'Test USDT',
            account_number: '123T',
            is_active: true
        })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
}
run();
