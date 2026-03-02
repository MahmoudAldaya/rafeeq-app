const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + supabaseKey.split('.')[1] + ".fake");

async function checkDb() {
    // Use raw fetch to use the service role key to bypass RLS and read admin_profiles
    const res = await fetch(`${supabaseUrl}/rest/v1/admin_profiles`, {
        headers: {
            "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Profile": "public"
        }
    });

    const text = await res.text();
    console.log("admin_profiles table contents:");
    console.log(text);

    const usersRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        headers: {
            "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        }
    });
    const usersText = await usersRes.json();
    console.log("\nUsers in auth.users:");
    if (usersText.users) {
        usersText.users.forEach(u => console.log(u.email));
    } else {
        console.log(usersText);
    }
}

checkDb();
