import { promises as fs } from "fs";
import path from "path";

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
