import os
import shutil

def safe_remove(path):
    if os.path.exists(path):
        if os.path.isdir(path):
            shutil.rmtree(path)
            print(f"Removed directory: {path}")
        else:
            os.remove(path)
            print(f"Removed file: {path}")
    else:
        print(f"Not found: {path}")

paths = [
    "data/all_subtitles.txt",
    "data/chunks.json",
    "data/embeddings.index",
    "data/metadata.json",
    "data/transcripts"
]

print("Resetting RAG pipeline output...")
for p in paths:
    safe_remove(p)

print("All clean. You can now run `npm run start` to regenerate everything.")
