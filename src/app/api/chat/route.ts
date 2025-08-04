import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages)) {
      return new Response("Invalid request format: 'messages' must be an array.", { status: 400 });
    }

    const res = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages,
      stream: true,
    });

    return new Response(res.toReadableStream());
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
