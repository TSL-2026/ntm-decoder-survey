import { createClient } from "@supabase/supabase-js";

function escapeCsv(value: any) {
  if (!value) return "";
  return `"${String(value).replace(/"/g, '""')}"`;
}

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("responses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response("Error exporting", { status: 500 });
  }

  const headers = [
    "created_at",
    "email",
    "role",
    "use_case",
    "source",
    "feedback",
  ];

  const rows = (data || []).map((r) =>
    [
      escapeCsv(r.created_at),
      escapeCsv(r.email),
      escapeCsv(r.role),
      escapeCsv(r.use_case),
      escapeCsv(r.source),
      escapeCsv(r.feedback),
    ].join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=responses.csv",
    },
  });
}
