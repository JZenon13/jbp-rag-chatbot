"use client";

import { FormEvent, useEffect, useState } from "react";
import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "done">("idle");
  const [suggested, setSuggested] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/suggestions")
      .then((res) => res.json())
      .then((data) => setSuggested(data))
      .catch((err) => console.error("Failed to fetch suggestions:", err));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitQuestion(question);
  }

  async function submitQuestion(q: string) {
    setStatus("pending");
    setAnswer("");
    setQuestion(q);

    const res = await fetch("/api/answer", {
      method: "POST",
      body: JSON.stringify({ question: q }),
    });

    if (!res.body) return;

    ChatCompletionStream.fromReadableStream(res.body)
      .on("content", (delta) => setAnswer((text) => text + delta))
      .on("end", () => setStatus("done"));
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl grow flex-col px-4">
      {status === "idle" ? (
        <div className="flex grow flex-col justify-center">
          <h1 className="text-3xl font-bold pb-3">
            Dive Deeper Into Jordan Peterson&#39;s Genesis Lectures
          </h1>

          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <input
              placeholder="Ask a question"
              autoFocus
              name="prompt"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="block w-full rounded border border-gray-300 p-2 outline-black"
            />
            <button
              className="rounded bg-black px-3 py-1 font-medium text-white outline-offset-[3px] outline-black"
              type="submit"
            >
              Submit
            </button>
          </form>

          {suggested.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 font-semibold">Try one of these:</p>
              <ul className="space-y-1">
                {suggested.map((q, i) => (
                  <li key={i}>
                    <button
                      onClick={() => submitQuestion(q)}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-col justify-end">
            <div className="grid grid-cols-4">
              <p className="col-span-3 text-xl">{question}</p>
              <div className="text-right">
                <button
                  className="rounded bg-black px-3 py-2 font-medium text-white disabled:opacity-50"
                  disabled={status === "pending"}
                  onClick={() => {
                    setQuestion("");
                    setAnswer("");
                    setStatus("idle");
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="py-8">
            <p className="whitespace-pre-wrap">{answer}</p>
          </div>
        </>
      )}
    </div>
  );
}
