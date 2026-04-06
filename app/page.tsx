"use client";

import { useMemo, useState } from "react";

type Proposal = {
  concept: string;
  flower: string;
  jewel: string;
  location: string;
  date: string;
  time: string;
};

const concepts = [
  {
    key: "tangerine",
    label: "When life gives you tangerine",
    description: "A sweet promise with soft citrus feelings.",
  },
  {
    key: "moonlit",
    label: "Moonlit confession",
    description: "A secret heart note under starry skies.",
  },
  {
    key: "petal",
    label: "Petal letter",
    description: "A gentle love note carried by flower petals.",
  },
];

const flowers = [
  { key: "rose", label: "Rose", emoji: "🌹", description: "Classic romantic bloom." },
  { key: "sunflower", label: "Sunflower", emoji: "🌻", description: "Bright and cheerful choice." },
  { key: "lily", label: "Lily", emoji: "🌸", description: "Soft, sweet, and elegant." },
];

const jewels = [
  { key: "hairpin", label: "Hairpin", emoji: "✨", description: "A delicate sparkle." },
  { key: "hairclip", label: "Hairclip", emoji: "🎀", description: "Cute and charming." },
  { key: "ring", label: "Ring", emoji: "💍", description: "A promise for forever." },
  { key: "locket", label: "Locket", emoji: "📿", description: "Keeps memories close." },
];

const places = [
  { key: "Mall", label: "Mall", emoji: "🛍️", description: "A sweet shopping date." },
  { key: "Beach", label: "Beach", emoji: "🏖️", description: "A dreamy seaside walk." },
  { key: "Cafe", label: "Cafe", emoji: "☕", description: "A cozy pastel cafe moment." },
];

const steps = [
  "K-Drama Concept",
  "Pick Your Flower",
  "Choose a Jewel",
  "Choose a Place",
  "Pick a Date",
  "Pick a Time",
  "Summary",
];

const defaultDate = new Date().toISOString().slice(0, 10);

export default function HomePage() {
  const [step, setStep] = useState(1);
  const [proposal, setProposal] = useState<Proposal>({
    concept: "",
    flower: "",
    jewel: "",
    location: "",
    date: defaultDate,
    time: "18:00",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const minDate = useMemo(() => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().slice(0, 10);
  }, []);

  const updateField = (field: keyof Proposal, value: string) => {
    setProposal((current) => ({ ...current, [field]: value }));
  };

  const nextStep = () => {
    if (step < steps.length) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposal),
      });
      if (!response.ok) {
        throw new Error("Could not save the proposal.");
      }
      setSuccess("Your dreamy proposal has been saved in the book of memories!");
    } catch (err) {
      setError("Sorry, something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <section className="card step-card">
            <div className="hero-row">
              <div>
                <p className="eyebrow">Step 1 · Love concept</p>
                <h1>When life gives you tangerine ✨</h1>
                <p className="description">
                  Pick a cozy, K-Drama inspired love concept to begin your date proposal story.
                </p>
              </div>
              <div className="hero-badge">💌</div>
            </div>
            <div className="grid-three">
              {concepts.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={proposal.concept === item.key ? "choice-card selected" : "choice-card"}
                  onClick={() => updateField("concept", item.key)}
                >
                  <span className="choice-icon">🍊</span>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </button>
              ))}
            </div>
          </section>
        );
      case 2:
        return (
          <section className="card step-card">
            <div className="hero-row">
              <div>
                <p className="eyebrow">Step 2 · Flower choice</p>
                <h1>Pick a flower from the vase 🌼</h1>
                <p className="description">Choose the bloom that feels the most magical for your date.</p>
              </div>
              <div className="hero-badge">🌸</div>
            </div>
            <div className="grid-three">
              {flowers.map((flower) => (
                <button
                  key={flower.key}
                  type="button"
                  className={proposal.flower === flower.key ? "choice-card selected" : "choice-card"}
                  onClick={() => updateField("flower", flower.key)}
                >
                  <div className="choice-icon">{flower.emoji}</div>
                  <strong>{flower.label}</strong>
                  <small>{flower.description}</small>
                </button>
              ))}
            </div>
          </section>
        );
      case 3:
        return (
          <section className="card step-card">
            <div className="hero-row">
              <div>
                <p className="eyebrow">Step 3 · Treasure box</p>
                <h1>Open the jewel box 💎</h1>
                <p className="description">Pick one special treasure to make the proposal extra cute.</p>
              </div>
              <div className="hero-badge">🎁</div>
            </div>
            <div className="grid-four">
              {jewels.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={proposal.jewel === item.key ? "choice-card selected" : "choice-card"}
                  onClick={() => updateField("jewel", item.key)}
                >
                  <div className="choice-icon">{item.emoji}</div>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </button>
              ))}
            </div>
          </section>
        );
      case 4:
        return (
          <section className="card step-card">
            <div className="hero-row">
              <div>
                <p className="eyebrow">Step 4 · Date destination</p>
                <h1>Choose the perfect place</h1>
                <p className="description">Where will your sweet date story happen?</p>
              </div>
              <div className="hero-badge">📍</div>
            </div>
            <div className="grid-three">
              {places.map((place) => (
                <button
                  key={place.key}
                  type="button"
                  className={proposal.location === place.key ? "choice-card selected" : "choice-card"}
                  onClick={() => updateField("location", place.key)}
                >
                  <div className="choice-icon">{place.emoji}</div>
                  <strong>{place.label}</strong>
                  <small>{place.description}</small>
                </button>
              ))}
            </div>
          </section>
        );
      case 5:
        return (
          <section className="card step-card">
            <div className="hero-row">
              <div>
                <p className="eyebrow">Step 5 · Date selection</p>
                <h1>Pick a cute day on the calendar</h1>
                <p className="description">A dreamy date deserves a dreamy day.</p>
              </div>
              <div className="hero-badge">📅</div>
            </div>
            <div className="calendar-card">
              <p className="calendar-label">Selected day</p>
              <input
                aria-label="Choose a date"
                className="date-input"
                type="date"
                min={minDate}
                value={proposal.date}
                onChange={(event) => updateField("date", event.target.value)}
              />
              <p className="calendar-hint">Your day: <strong>{proposal.date}</strong></p>
            </div>
          </section>
        );
      case 6:
        return (
          <section className="card step-card">
            <div className="hero-row">
              <div>
                <p className="eyebrow">Step 6 · Time of day</p>
                <h1>Pick a time from the wall clock</h1>
                <p className="description">Choose a moment when everything feels just right.</p>
              </div>
              <div className="hero-badge">🕰️</div>
            </div>
            <div className="clock-card">
              <div className="clock-face">
                <span className="clock-emoji">🕒</span>
              </div>
              <input
                aria-label="Choose time"
                className="time-input"
                type="time"
                step={1800}
                value={proposal.time}
                onChange={(event) => updateField("time", event.target.value)}
              />
              <p className="clock-hint">Your chosen time: <strong>{proposal.time}</strong></p>
            </div>
          </section>
        );
      case 7:
        return (
          <section className="card step-card summary-card">
            <div className="hero-row">
              <div>
                <p className="eyebrow">Step 7 · Final summary</p>
                <h1>Your cute proposal is ready!</h1>
                <p className="description">Review your choices and save them forever.</p>
              </div>
              <div className="hero-badge">💖</div>
            </div>
            <div className="summary-grid">
              <div className="summary-item">
                <p>Concept</p>
                <strong>{proposal.concept || "Not chosen yet"}</strong>
              </div>
              <div className="summary-item">
                <p>Flower</p>
                <strong>{proposal.flower || "Not chosen yet"}</strong>
              </div>
              <div className="summary-item">
                <p>Jewel</p>
                <strong>{proposal.jewel || "Not chosen yet"}</strong>
              </div>
              <div className="summary-item">
                <p>Place</p>
                <strong>{proposal.location || "Not chosen yet"}</strong>
              </div>
              <div className="summary-item">
                <p>Date</p>
                <strong>{proposal.date}</strong>
              </div>
              <div className="summary-item">
                <p>Time</p>
                <strong>{proposal.time}</strong>
              </div>
            </div>
            <button className="action-button" type="button" onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Save My Proposal"}
            </button>
            {success ? <p className="status success">{success}</p> : null}
            {error ? <p className="status error">{error}</p> : null}
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <main className="page-shell">
      <div className="top-bar">
        <div>
          <p className="brand">Date Proposal</p>
          <p className="tagline">A cute, K-Drama inspired journey to your perfect date.</p>
        </div>
        <span className="sparkle">✨</span>
      </div>
      <div className="progress-bar">
        {steps.map((label, index) => (
          <div key={label} className={index + 1 === step ? "progress-step active" : "progress-step"}>
            <span>{index + 1}</span>
            <small>{label}</small>
          </div>
        ))}
      </div>
      {renderStep()}
      <div className="nav-buttons">
        <button className="nav-button" type="button" onClick={prevStep} disabled={step === 1}>
          Back
        </button>
        {step < 7 ? (
          <button className="nav-button primary" type="button" onClick={nextStep}>
            Next
          </button>
        ) : null}
      </div>
    </main>
  );
}
