import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const origin = requestUrl.origin;

    if (code) {
        const supabase = await createServerSupabaseClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    // Redirect to profile after email confirmation
    return NextResponse.redirect(`${origin}/profile`);
}
