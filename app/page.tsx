import SurveyForm from "../components/SurveyForm";

export default function Home() {
  return (
    <main style={{ maxWidth: 500, margin: "40px auto", padding: 20 }}>
      <h1>NTM Decoder — Early Access (Beta)</h1>

      <p>
        Convert NOTAM, TAF, and METAR into plain English with operational summaries.
      </p>

      <SurveyForm />
    </main>
  );
}
