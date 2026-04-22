import { createClient } from "@supabase/supabase-js";

type ResponseRow = {
  id: string;
  email: string;
  role: string;
  use_case: string;
  feedback: string | null;
  source: string | null;
  created_at: string;
};

type Counts = Record<string, number>;

export default async function AdminPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("responses")
    .select("id, email, role, use_case, feedback, source, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={mainStyle}>
        <h1>Admin</h1>
        <p>Unable to load responses.</p>
      </main>
    );
  }

  const rows = (data ?? []) as ResponseRow[];
  const roleCounts = countBy(rows, "role");
  const useCaseCounts = countBy(rows, "use_case");
  const sourceCounts = countBy(rows, "source");

  return (
    <main style={mainStyle}>
      <h1>Admin — NTM Decoder Beta Responses</h1>
      <p style={{ color: "#666" }}>
        Total responses: <strong>{rows.length}</strong>
      </p>

      <div style={statsGridStyle}>
        <StatCard title="Roles" data={roleCounts} />
        <StatCard title="Use cases" data={useCaseCounts} />
        <StatCard title="Sources" data={sourceCounts} />
      </div>

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0 }}>Responses</h2>

        {rows.length === 0 ? (
          <p>No responses yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Use case</th>
                  <th style={thStyle}>Source</th>
                  <th style={thStyle}>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td style={tdStyle}>
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td style={tdStyle}>{row.email}</td>
                    <td style={tdStyle}>{row.role}</td>
                    <td style={tdStyle}>{row.use_case}</td>
                    <td style={tdStyle}>{row.source || "direct"}</td>
                    <td style={tdStyle}>{row.feedback || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function countBy<T extends Record<string, any>>(items: T[], key: keyof T): Counts {
  return items.reduce((acc: Counts, item) => {
    const value = item[key] || "Unknown";
    const label = String(value);
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
}

function StatCard({ title, data }: { title: string; data: Counts }) {
  return (
    <section style={cardStyle}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {Object.entries(data)
          .sort((a, b) => b[1] - a[1])
          .map(([label, count]) => (
            <div
              key={label}
              style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
            >
              <span>{label}</span>
              <strong>{count}</strong>
            </div>
          ))}
      </div>
    </section>
  );
}

const mainStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: "40px auto",
  padding: 20,
};

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
  marginTop: 20,
  marginBottom: 24,
};

const sectionStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 20,
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 16,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 900,
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 10px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: 14,
  color: "#374151",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 10px",
  borderBottom: "1px solid #f0f0f0",
  verticalAlign: "top",
  fontSize: 14,
};
