// fresh redeploy
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || "").trim();
    const role = String(body.role || "").trim();
    const use_case = String(body.use_case || "").trim();
    const feedback = String(body.feedback || "").trim();
    const source = String(body.source || "direct").trim();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from("responses").insert([
      {
        email,
        email_normalized: normalizeEmail(email),
        role,
        use_case,
        feedback: feedback || null,
        source,
      },
    ]);

    if (error) {
      if (error.message.includes("duplicate")) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
