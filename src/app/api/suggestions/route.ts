export async function GET() {
  const suggestions = [
    "What does Jordan Peterson say about the concept of God in Genesis?",
      "How does Peterson interpret the story of Cain and Abel?",
      "What is the symbolic meaning of the serpent?",
      "Why does Peterson emphasize responsibility?",
      "How are order and chaos represented in Genesis?",
      "What does Peterson say about the creation of man and woman?",
      "How does he connect biblical stories to modern psychology?",
      "Why does Peterson consider Genesis foundational to Western thought?",
  ];

  return new Response(JSON.stringify(suggestions), {
    headers: { "Content-Type": "application/json" },
  });
}
