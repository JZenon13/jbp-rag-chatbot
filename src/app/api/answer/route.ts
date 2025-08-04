import Together from "together-ai";
import { spawn } from "child_process";
import path from "path";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY!,
});

export async function POST(request: Request) {
  const { question } = await request.json();
  const searchScriptPath = path.join(process.cwd(), "scripts", "search_chunks_backend.py");
  const contextChunks: string[] = await new Promise((resolve, reject) => {
    let output = "";

    const proc = spawn("python", [searchScriptPath, question]);

    proc.stdout.on("data", (data) => {
      output += data.toString();
    });

    proc.stderr.on("data", (err) => {
      console.error("Python stderr:", err.toString());
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        return reject(`Python script exited with code ${code}`);
      }

      try {
        const parsed = JSON.parse(output);
        resolve(parsed);
      } catch (e) {
        reject(`Failed to parse Python output: ${e}`);
      }
    });
  });

  if (!contextChunks.length) {
    return new Response("No relevant context found for your question.", { status: 200 });
  }

  const maxPromptLength = 3000;
  let promptContext = "";
  for (const chunk of contextChunks) {
    if ((promptContext + chunk).length > maxPromptLength) break;
    promptContext += chunk + "\n\n";
  }

  const prompt = `
Use the following context from Jordan Peterson's Genesis lecture series to answer the question. Be specific and reference the ideas clearly.

Context:
${promptContext}

Question:
${question}
  `.trim();

  const res = await together.chat.completions.create({
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that answers based on Jordan Peterson’s Genesis lectures.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
  });

  return new Response(res.toReadableStream());
}
