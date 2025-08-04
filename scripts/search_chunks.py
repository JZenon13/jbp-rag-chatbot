import os
import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

CHUNKS_FILE = "data/metadata.json"
EMBEDDINGS_INDEX_FILE = "data/embeddings.index"

print("Loading embedding model...")
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

if not os.path.exists(EMBEDDINGS_INDEX_FILE):
    raise FileNotFoundError(f"{EMBEDDINGS_INDEX_FILE} not found. Run embed_chunks.py first.")

print("Loading FAISS index...")
index = faiss.read_index(EMBEDDINGS_INDEX_FILE)

with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
    metadata = json.load(f)

def search_chunks(query: str, top_k: int = 3):
    print(f"Searching for: \"{query}\"")

    query_embedding = model.encode([query])
    D, I = index.search(np.array(query_embedding), top_k)

    results = []
    for i in I[0]:
        if i < len(metadata):
            results.append(metadata[i])
    return results

if __name__ == "__main__":
    while True:
        try:
            user_input = input("\nAsk a question (or type 'exit'): ").strip()
            if user_input.lower() == "exit":
                break

            top_chunks = search_chunks(user_input, top_k=3)
            print("\nTop Relevant Chunks:")
            for i, chunk in enumerate(top_chunks, 1):
                print(f"\n[{i}] Video: {chunk['video_id']} | Chunk #{chunk['chunk_index']}")
                print(chunk["text"])

        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
