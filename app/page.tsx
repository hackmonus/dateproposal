"use client";

import { useMemo, useState } from "react";

type Choice = { key: string; label: string; emoji: string; description: string };
type Plan = { food: string; foodDetail: string; venue: string; activity: string; zone: string; date: string; time: string; theme: string; herEmail: string; herShare: number; message: string };

const food: Choice[] = [
  { key: "pizza", label: "Pizza", emoji: "🍕", description: "Cheesy slices and extra toppings." },
  { key: "burger", label: "Burger", emoji: "🍔", description: "A proper Mumbai comfort-food date." },
  { key: "chaat", label: "Chaat", emoji: "🥣", description: "Pani puri, bhel, and maximum gossip." },
];
const burgerPlaces: Choice[] = [
  { key: "Burger King", label: "Burger King", emoji: "👑", description: "Whopper, fries, and a royal little date." },
  { key: "McDonald's", label: "McDonald's", emoji: "🍟", description: "McSpicy, fries, and sharing the last bite." },
];
const pizzaPlaces: Choice[] = [
  { key: "Pizza Hut", label: "Pizza Hut", emoji: "🍕", description: "A warm booth and a cheesy plan." },
  { key: "Domino's", label: "Domino's", emoji: "📦", description: "The classic comfort-food delivery feeling." },
];
const chaatPlaces: Choice[] = [
  { key: "Juhu chaat", label: "Juhu chaat", emoji: "🌊", description: "Tangy, crunchy, and very Mumbai." },
  { key: "Ghatkopar khau galli", label: "Ghatkopar khau galli", emoji: "✨", description: "A street-food adventure for two." },
];
const zones: Choice[] = [
  { key: "Dahisar–Virar", label: "Dahisar–Virar", emoji: "🌅", description: "A breezy western-suburbs plan." },
  { key: "Malad–Borivali", label: "Malad–Borivali", emoji: "🌷", description: "A relaxed neighbourhood date." },
  { key: "Andheri–Malad", label: "Andheri–Malad", emoji: "🎬", description: "Easy, lively, and full of stories." },
  { key: "Churchgate–Andheri", label: "Churchgate–Andheri", emoji: "🚆", description: "The city lights, sea breeze, and us." },
];
const themes: Choice[] = [
  { key: "Cherry red", label: "Cherry red", emoji: "🍒", description: "Bold, warm, and very romantic." },
  { key: "Butter yellow", label: "Butter yellow", emoji: "🌼", description: "Sunny, soft, and impossible not to smile at." },
  { key: "Sage green", label: "Sage green", emoji: "🌿", description: "Calm, fresh, and quietly lovely." },
  { key: "Sky blue", label: "Sky blue", emoji: "🩵", description: "A little dreamy and wide open." },
];
const steps = ["Food", "The tiny detail", "Where", "Mumbai", "Date", "Time", "Your colour", "Bill", "The letter"];
const defaultDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<Plan>({ food: "", foodDetail: "", venue: "", activity: "", zone: "", date: defaultDate, time: "18:00", theme: "", herEmail: "", herShare: 50, message: "" });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const minDate = useMemo(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10), []);
  const update = (field: keyof Plan, value: string | number) => setPlan((current) => ({ ...current, [field]: value }));
  const optionsForFood = plan.food === "burger" ? burgerPlaces : plan.food === "pizza" ? pizzaPlaces : chaatPlaces;
  const activities = plan.venue === "Mall" ? [{ key: "Window shopping", label: "Window shopping", emoji: "🛍️", description: "We look at everything and buy one cute thing." }, { key: "Movie", label: "Movie", emoji: "🎬", description: "Cinema, popcorn, and leaning a little closer." }] : [{ key: "Park", label: "Park", emoji: "🌳", description: "A slow walk and all the important gossip." }, { key: "Beach", label: "Beach", emoji: "🏖️", description: "Sea breeze, sunset, and sandy shoes." }];
  const select = (field: keyof Plan, value: string) => {
    if (field === "food") setPlan((current) => ({ ...current, food: value, foodDetail: "" }));
    else if (field === "venue") setPlan((current) => ({ ...current, venue: value, activity: "" }));
    else update(field, value);
  };

  const handleSubmit = async () => {
    setSaving(true); setStatus(null);
    try {
      const response = await fetch("/api/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(plan) });
      if (!response.ok) throw new Error("send failed");
      setStatus({ kind: "success", text: "The letter flew away! Check your inboxes for your date plan. 💌" });
    } catch { setStatus({ kind: "error", text: "The letter got shy. Please check the email and try once more." }); } finally { setSaving(false); }
  };

  const renderCards = (items: Choice[], field: keyof Plan) => <div className="choice-grid">{items.map((item) => <button type="button" key={item.key} className={`choice-card ${plan[field] === item.key ? "selected" : ""}`} onClick={() => select(field, item.key)}><span className="choice-icon">{item.emoji}</span><strong>{item.label}</strong><small>{item.description}</small></button>)}</div>;
  const renderStep = () => {
    if (step === 1) return <Step title="What are we eating?" note="Pick the first little piece of our Mumbai date." icon="🍕">{renderCards(food, "food")}</Step>;
    if (step === 2) return <Step title={`Okay, ${plan.food || "food"} it is. Where from?`} note="The details make the plan feel real." icon="🍟">{renderCards(optionsForFood, "foodDetail")}</Step>;
    if (step === 3) return <Step title="What kind of date are we making?" note="Choose the setting, then we will make it specific." icon="💌">{renderCards([{ key: "Outlet", label: "A favourite outlet", emoji: "🍽️", description: "Sit, eat, and talk until we lose track of time." }, { key: "Mall", label: "A mall adventure", emoji: "🏬", description: "A little exploring with snack breaks." }], "venue")}{plan.venue ? <div className="sub-choice"><p className="mini-label">And the vibe?</p>{renderCards(activities, "activity")}</div> : null}</Step>;
    if (step === 4) return <Step title="Which Mumbai chapter?" note="Pick the part of the city that feels easiest for us." icon="📍">{renderCards(zones, "zone")}</Step>;
    if (step === 5) return <Step title="Circle our day" note="Choose a date that makes your heart do a tiny jump." icon="📅"><div className="date-panel"><div className="calendar-sticker">🌹</div><label htmlFor="date">Our date</label><input id="date" className="date-input" type="date" min={minDate} value={plan.date} onChange={(event) => update("date", event.target.value)} /><p>{new Date(`${plan.date}T12:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p></div></Step>;
    if (step === 6) return <Step title="When should I keep my evening free?" note="A clock, but make it romantic." icon="⏰"><div className="date-panel"><div className="clock-sticker">🧸</div><label htmlFor="time">Our time</label><input id="time" className="time-input" type="time" step={1800} value={plan.time} onChange={(event) => update("time", event.target.value)} /><p>Perfect. I will be there with the good stories.</p></div></Step>;
    if (step === 7) return <Step title="Pick the colour of this date" note="I will take this as a hint for your favourite colour." icon="🎨"><div className="theme-grid">{themes.map((theme) => <button type="button" key={theme.key} className={`theme-card ${plan.theme === theme.key ? "selected" : ""}`} onClick={() => select("theme", theme.key)}><span>{theme.emoji}</span><strong>{theme.label}</strong><small>{theme.description}</small></button>)}</div><div className="email-field"><label htmlFor="herEmail">Where should your copy arrive?</label><input id="herEmail" type="email" placeholder="your.email@example.com" value={plan.herEmail} onChange={(event) => update("herEmail", event.target.value)} /><small>Your email is only used to send this date letter.</small></div></Step>;
    if (step === 8) return <Step title="How shall we split the bill?" note="50–50 is the default, but you get the final say." icon="🧾"><div className="bill-panel"><div className="bill-figures"><span><b>{100 - plan.herShare}%</b><small>my share</small></span><span className="heart-divider">♥</span><span><b>{plan.herShare}%</b><small>your share</small></span></div><input aria-label="Her share of the bill" className="range-input" type="range" min="0" max="100" value={plan.herShare} onChange={(event) => update("herShare", Number(event.target.value))} /><div className="range-labels"><span>My treat</span><span>Perfectly split</span><span>Your treat</span></div><div className="estimate"><span>Approx date budget</span><strong>₹{plan.food === "chaat" ? "900" : plan.venue === "Mall" ? "2,400" : "1,600"}</strong></div></div></Step>;
    return <Step title="Read the little letter back" note="Everything looks sweeter when it is all together." icon="💖"><div className="summary-grid">{[["Food", `${plan.food} · ${plan.foodDetail}`], ["Plan", `${plan.venue} · ${plan.activity}`], ["Mumbai", plan.zone], ["When", `${new Date(`${plan.date}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} at ${plan.time}`], ["Colour", plan.theme], ["Bill", `You ${plan.herShare}% · Me ${100 - plan.herShare}%`]].map(([label, value]) => <div className="summary-item" key={label}><small>{label}</small><strong>{value}</strong></div>)}</div><div className="email-field"><label htmlFor="message">Add a tiny note (optional)</label><textarea id="message" placeholder="I cannot wait to see you..." value={plan.message} onChange={(event) => update("message", event.target.value)} /></div><button className="send-button" type="button" onClick={handleSubmit} disabled={saving}>{saving ? "Sending the letter..." : "Send our date plan 💌"}</button>{status ? <p className={`status ${status.kind}`}>{status.text}</p> : null}<p className="privacy-note">Your copy goes to the email above. My copy goes to the private address set in the app.</p></Step>;
  };

  if (!open) return <main className="landing"><div className="floating flower flower-one">🌹</div><div className="floating flower flower-two">💗</div><div className="teddy-stage"><div className="teddy">🧸</div><div className="letter"><span>For you</span><b>💌</b></div></div><p className="landing-kicker">A tiny date proposal</p><h1>Open when you are ready<br /><em>for a little us.</em></h1><p className="landing-copy">There is a whole evening hiding in this letter. Choose the details, keep the date, and send it back to me.</p><button className="open-button" type="button" onClick={() => setOpen(true)}>Open the letter <span>→</span></button><div className="landing-footer">made with <span>♥</span> in Mumbai</div></main>;
  return <main className="app-shell"><header className="app-header"><div className="wordmark"><span>♥</span> our little plan</div><div className="header-doodles">🌹 🧸</div></header><div className="progress-wrap"><div className="progress-meta"><span>chapter {String(step).padStart(2, "0")}</span><span>{steps[step - 1]} / {steps.length}</span></div><div className="progress-track"><span style={{ width: `${(step / steps.length) * 100}%` }} /></div></div><section className="paper"><div className="paper-tape">with love</div>{renderStep()}</section><div className="nav-buttons"><button className="back-button" type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>← back</button>{step < steps.length ? <button className="next-button" type="button" onClick={() => setStep((current) => Math.min(steps.length, current + 1))} disabled={!((step === 1 && plan.food) || (step === 2 && plan.foodDetail) || (step === 3 && plan.venue && plan.activity) || (step === 4 && plan.zone) || (step === 5 && plan.date) || (step === 6 && plan.time) || (step === 7 && plan.theme && plan.herEmail) || step === 8)}>next page <span>→</span></button> : null}</div><p className="bottom-note">made for two people, one very good evening <span>♥</span></p></main>;
}

function Step({ title, note, icon, children }: { title: string; note: string; icon: string; children: React.ReactNode }) { return <div className="step-content"><div className="step-heading"><div><p className="eyebrow">a new page in the letter</p><h1>{title}</h1><p className="description">{note}</p></div><span className="step-icon">{icon}</span></div>{children}</div>; }