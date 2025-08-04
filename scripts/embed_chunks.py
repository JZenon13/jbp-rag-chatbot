import os
import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

CHUNKS_FILE = "data/chunks.json"
EMBEDDINGS_INDEX_FILE = "data/embeddings.index"
METADATA_FILE = "data/metadata.json"

if os.path.exists(EMBEDDINGS_INDEX_FILE) and os.path.exists(METADATA_FILE):
    print("Embeddings already exist — skipping embedding.")
    exit(0)

with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
    chunks = json.load(f)

print(f"Loaded {len(chunks)} chunks from {CHUNKS_FILE}")

print("Loading embedding model...")
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

print("Embedding chunks...")
texts = [chunk["text"] for chunk in chunks]
embeddings = model.encode(texts, show_progress_bar=True)

dimension = embeddings[0].shape[0]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings))

os.makedirs("data", exist_ok=True)
faiss.write_index(index, EMBEDDINGS_INDEX_FILE)
print(f"Saved FAISS index to {EMBEDDINGS_INDEX_FILE}")

with open(METADATA_FILE, "w", encoding="utf-8") as f:
    json.dump(chunks, f, ensure_ascii=False, indent=2)
print(f"Saved metadata to {METADATA_FILE}")
