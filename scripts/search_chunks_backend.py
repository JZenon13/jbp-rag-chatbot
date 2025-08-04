import os
import sys
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

INDEX_FILE = "data/embeddings.index"
METADATA_FILE = "data/metadata.json"
TOP_K = 3

def load_model():
    print("Loading model...", file=sys.stderr)
    return SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def load_index():
    if not os.path.exists(INDEX_FILE):
        raise FileNotFoundError(f"FAISS index not found: {INDEX_FILE}")
    return faiss.read_index(INDEX_FILE)

def load_metadata():
    if not os.path.exists(METADATA_FILE):
        raise FileNotFoundError(f"Metadata file not found: {METADATA_FILE}")
    with open(METADATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def search(query: str, model, index, metadata):
    query_vec = model.encode([query]).astype("float32")
    _, indices = index.search(query_vec, TOP_K)
    results = []
    for idx in indices[0]:
        if 0 <= idx < len(metadata):
            results.append(metadata[idx]["text"])
    return results

def main():
    if len(sys.argv) < 2:
        print(json.dumps([]))
        return

    query = sys.argv[1]
    model = load_model()
    index = load_index()
    metadata = load_metadata()

    top_chunks = search(query, model, index, metadata)
    print(json.dumps(top_chunks, ensure_ascii=False))

if __name__ == "__main__":
    main()
