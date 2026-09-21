import { promises as fs } from "fs";
import path from "path";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const filePath = path.join(process.cwd(), "data", "responses.json");
    const currentContent = await fs.readFile(filePath, "utf8");
    const responses = JSON.parse(currentContent) as Array<Record<string, unknown>>;
    const nextRecord = {
      ...payload,
      createdAt: new Date().toISOString(),
    };
    responses.push(nextRecord);
    await fs.writeFile(filePath, JSON.stringify(responses, null, 2), "utf8");
    const ownerEmail = process.env.OWNER_EMAIL;
    const herEmail = typeof payload.herEmail === "string" ? payload.herEmail : "";
    if (ownerEmail && herEmail && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === "true", auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
      const summary = `Food: ${payload.food} · ${payload.foodDetail}\nPlan: ${payload.venue} · ${payload.activity}\nMumbai: ${payload.zone}\nDate: ${payload.date} at ${payload.time}\nColour: ${payload.theme}\nBill: her ${payload.herShare}% / me ${100 - Number(payload.herShare)}%\nNote: ${payload.message || "No note added."}`;
      await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to: [ownerEmail, herEmail], subject: "Our little date plan 💌", text: `A date has been planned!\n\n${summary}\n\nSent with love from Mumbai.` });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Unable to save the proposal." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
