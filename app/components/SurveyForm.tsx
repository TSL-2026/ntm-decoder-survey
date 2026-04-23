"use client";

import { useState } from "react";

const steps = [
  "email",
  "role",
  "use_case",
  "feedback",
];

export default function SurveyForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "" | "success" | "warning" | "error"
  >("");

  const [formData, setFormData] = useState({
    email: "",
    role: "",
    use_case: "",
    feedback: "",
  });

  function next() {
    if (step < steps.length - 1) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  function update(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (message) {
      setMessage("");
      setMessageType("");
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const data = {
        ...formData,
        source: new URLSearchParams(window.location.search).get("src") || "direct",
      };

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage("Thank you! Your response has been recorded.");
        setMessageType("success");
        window.location.href = "/thanks";
        return;
      }

      if (res.status === 409) {
        setMessage(
          result.error || "This email has already submitted a response."
        );
        setMessageType("warning");
        return;
      }

      setMessage(result.error || "Something went wrong. Please try again.");
      setMessageType("error");
    } catch (error) {
      setMessage("Network error. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Progress */}
      <div>
        Step {step + 1} of {steps.length}
        <div
          style={{
            height: 6,
            background: "#eee",
            marginTop: 5,
          }}
        >
          <div
            style={{
              width: `${((step + 1) / steps.length) * 100}%`,
              height: "100%",
              background: "#0070f3",
            }}
          />
        </div>
      </div>

      {/* Step Content */}
      {step === 0 && (
        <>
          <h3>Your email?</h3>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="Email address"
          />
          <small style={{ color: "#6b7280" }}>
            One response per email.
          </small>
        </>
      )}

      {step === 1 && (
        <>
          <h3>Your role?</h3>
          <select
            value={formData.role}
            onChange={(e) => update("role", e.target.value)}
          >
            <option value="">Select</option>
            <option>Pilot</option>
            <option>Dispatcher</option>
            <option>ATC</option>
            <option>Aviation student</option>
            <option>Other</option>
          </select>
        </>
      )}

      {step === 2 && (
        <>
          <h3>How will you use it?</h3>
          <select
            value={formData.use_case}
            onChange={(e) => update("use_case", e.target.value)}
          >
            <option value="">Select</option>
            <option>Pre-flight briefing</option>
            <option>Dispatch / flight planning</option>
            <option>Training / learning</option>
            <option>General use</option>
          </select>
        </>
      )}

      {step === 3 && (
        <>
          <h3>What would make this valuable?</h3>
          <textarea
            value={formData.feedback}
            onChange={(e) => update("feedback", e.target.value)}
            placeholder="Optional"
          />
        </>
      )}

      {/* Inline Message */}
      {message && (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.5,
            background:
              messageType === "success"
                ? "#ecfdf3"
                : messageType === "warning"
                ? "#fffbeb"
                : "#fef2f2",
            color:
              messageType === "success"
                ? "#166534"
                : messageType === "warning"
                ? "#92400e"
                : "#b91c1c",
            border:
              messageType === "success"
                ? "1px solid #bbf7d0"
                : messageType === "warning"
                ? "1px solid #fde68a"
                : "1px solid #fecaca",
          }}
        >
          {message}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", gap: 10 }}>
        {step > 0 && (
          <button onClick={back} disabled={loading}>
            Back
          </button>
        )}

        {step < steps.length - 1 ? (
          <button
            onClick={next}
            disabled={
              loading ||
              (step === 0 && !formData.email) ||
              (step === 1 && !formData.role) ||
              (step === 2 && !formData.use_case)
            }
          >
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}