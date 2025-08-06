"use client";

import { FormEvent, useEffect, useState } from "react";
import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream";
import Spinner from "./components/Spinner";
import Bubble from "./components/Bubble";

type Msg = { role: "user" | "assistant"; content: string };

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [status, setStatus] = useState<"idle" | "pending" | "done">("idle");
  const [suggested, setSuggested] = useState<string[]>([]);
  const [suggestedLoading, setSuggestedLoading] = useState(true);

  useEffect(() => {
    fetch("/api/suggestions")
      .then((res) => res.json())
      .then((data) => setSuggested(data))
      .catch((err) => console.error("Failed to fetch suggestions:", err))
      .finally(() => setSuggestedLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!question.trim()) return;
    submitQuestion(question.trim());
  }

  async function submitQuestion(q: string) {
    setStatus("pending");

    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setQuestion("");

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const res = await fetch("/api/answer", {
      method: "POST",
      body: JSON.stringify({ question: q }),
    });

    if (!res.body) {
      setStatus("done");
      return;
    }

    const stream = ChatCompletionStream.fromReadableStream(res.body);
    stream
      .on("content", (delta) => {
        setMessages((prev) => {
          const next = [...prev];
          const lastIdx = next.length - 1;
          if (lastIdx >= 0 && next[lastIdx].role === "assistant") {
            next[lastIdx] = {
              ...next[lastIdx],
              content: next[lastIdx].content + delta,
            };
          }
          return next;
        });
      })
      .on("end", () => setStatus("done"))
      .on("error", () => setStatus("done"));
  }

  const isPending = status === "pending";

  return (
    <div className="mx-auto flex w-full max-w-3xl grow flex-col px-4 py-6">
   
      <div className="mb-4">
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
            disabled={isPending}
            aria-disabled={isPending}
          />
          <button
            className="inline-flex items-center justify-center gap-2 rounded bg-black px-3 py-1 font-medium text-white outline-offset-[3px] outline-black disabled:opacity-50"
            type="submit"
            disabled={isPending || !question.trim()}
          >
            {isPending ? (
              <>
                <Spinner className="h-4 w-4" />
                Submitting…
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>

        {/* Suggestions */}
        <div className="mt-4">
          <p className="mb-2 font-semibold">Try one of these:</p>
          {suggestedLoading ? (
            <div className="inline-flex items-center gap-2 text-gray-600">
              <Spinner className="h-4 w-4" />
              <span>Loading suggestions…</span>
            </div>
          ) : suggested.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {suggested.map((q, i) => (
                <li key={i}>
                  <button
                    onClick={() => submitQuestion(q)}
                    className="rounded-full border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
                    disabled={isPending}
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No suggestions available.</p>
          )}
        </div>
      </div>

       {messages.length > 0 || isPending ? (
          <div className="flex-1 overflow-y-auto rounded-lg border border-gray-200 p-3">
            {messages.map((m, idx) => (
              <Bubble key={idx} role={m.role}>
                {m.content || (m.role === "assistant" && isPending ? (
                  <span className="inline-flex items-center gap-2 text-gray-600">
                    <Spinner className="h-4 w-4" />
                    Generating…
                  </span>
                ) : null)}
              </Bubble>
            ))}
          </div>
        ) : null}
    </div>
  );
}
