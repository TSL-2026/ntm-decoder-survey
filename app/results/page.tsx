import { createClient } from "@supabase/supabase-js";

type Counts = Record<string, number>;

export default async function ResultsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("responses")
    .select("role, use_case, source, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={mainStyle}>
        <h1>Results</h1>
        <p>Unable to load results.</p>
      </main>
    );
  }

  const roleCounts = countBy(data ?? [], "role");
  const useCaseCounts = countBy(data ?? [], "use_case");
  const sourceCounts = countBy(data ?? [], "source");

  return (
    <main style={mainStyle}>
      <h1>NTM Decoder — Beta Interest</h1>
      <p style={{ color: "#666" }}>
        Total responses: <strong>{data?.length ?? 0}</strong>
      </p>

      <section style={sectionStyle}>
        <h2>By role</h2>
        <BarList data={roleCounts} />
      </section>

      <section style={sectionStyle}>
        <h2>By use case</h2>
        <BarList data={useCaseCounts} />
      </section>

      <section style={sectionStyle}>
        <h2>By source</h2>
        <BarList data={sourceCounts} />
      </section>
    </main>
  );
}

function countBy(items: any[], key: string): Counts {
  return items.reduce((acc: Counts, item) => {
    const value = item?.[key] || "Unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function BarList({ data }: { data: Counts }) {
  const max = Math.max(...Object.values(data), 1);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .map(([label, count]) => (
          <div key={label} style={{ display: "grid", gap: 6 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                fontSize: 14,
              }}
            >
              <span>{label}</span>
              <strong>{count}</strong>
            </div>
            <div
              style={{
                height: 10,
                background: "#e5e7eb",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(count / max) * 100}%`,
                  height: "100%",
                  background: "#111827",
                }}
              />
            </div>
          </div>
        ))}
    </div>
  );
}

const mainStyle: React.CSSProperties = {
  maxWidth: 760,
  margin: "40px auto",
  padding: 20,
};

const sectionStyle: React.CSSProperties = {
  marginTop: 28,
  padding: 20,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
};
