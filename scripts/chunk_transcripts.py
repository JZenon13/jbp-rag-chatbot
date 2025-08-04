import os
import re
import json

TRANSCRIPTS_DIR = "data/transcripts"
OUTPUT_FILE = "data/chunks.json"
MAX_CHARS = 800  # max characters per chunk

if os.path.exists(OUTPUT_FILE):
    print("chunks.json already exists — skipping chunking.")
    exit(0)
    
def clean_and_load_srt(path):
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    content_lines = [
        line.strip() for line in lines
        if line.strip() and not line.strip().isdigit() and "-->" not in line
    ]

    return " ".join(content_lines)

def chunk_text(text, max_chars=MAX_CHARS):
    sentences = re.split(r"(?<=[.?!])\s+", text)
    chunks = []
    current = ""

    for sentence in sentences:
        if len(current) + len(sentence) <= max_chars:
            current += sentence + " "
        else:
            chunks.append(current.strip())
            current = sentence + " "

    if current:
        chunks.append(current.strip())

    return chunks

all_chunks = []

for filename in os.listdir(TRANSCRIPTS_DIR):
    if filename.endswith(".srt"):
        video_id = filename.split(".")[0]
        print(f"Chunking {video_id}...")
        srt_path = os.path.join(TRANSCRIPTS_DIR, filename)
        full_text = clean_and_load_srt(srt_path)
        chunks = chunk_text(full_text)

        for i, chunk in enumerate(chunks):
            all_chunks.append({
                "video_id": video_id,
                "chunk_index": i,
                "text": chunk
            })

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(all_chunks, f, ensure_ascii=False, indent=2)

print(f"\n Chunked {len(all_chunks)} chunks into {OUTPUT_FILE}")
