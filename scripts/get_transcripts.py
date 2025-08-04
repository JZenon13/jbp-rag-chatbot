import os
import yt_dlp

output_folder = "data/transcripts"
output_file = "data/all_subtitles.txt"

if os.path.exists(output_file):
    print("Transcripts already exist — skipping fetch.")
    exit(0)

video_ids = [
    "f-wWBGo6a2w", "hdrLQ7DpiWs", "R_GPAl_q2QQ", "KU1Ua-gNXL4", "44f3mxcsI50",
    "wNjbasba-Qw", "6gFjB9FTN58", "UoQdp2prfmM", "GmuzUZTJ0GA", "3Y6bCqT85Pc",
    "SKzpj0Ev8Xs", "-yUP40gwht0", "A9JtQN_GoVI", "DRJKwDfDbco", "B7V8eZ1BLiI"
]

os.makedirs(output_folder, exist_ok=True)

def download_subtitles(video_id):
    url = f"https://www.youtube.com/watch?v={video_id}"
    ydl_opts = {
        "skip_download": True,
        "writesubtitles": True,
        "writeautomaticsub": True,
        "subtitleslangs": ["en"],
        "subtitlesformat": "srt",
        "quiet": True,
        "outtmpl": f"{output_folder}/{video_id}.%(ext)s"
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

def clean_srt_to_text(srt_path):
    with open(srt_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    text_lines = []
    for line in lines:
        if line.strip() and not line.strip().isdigit() and "-->" not in line:
            text_lines.append(line.strip())

    return " ".join(text_lines)

with open(output_file, "w", encoding="utf-8") as outfile:
    for video_id in video_ids:
        print(f"Fetching transcript for {video_id}...")
        try:
            download_subtitles(video_id)
            srt_filename = os.path.join(output_folder, f"{video_id}.en.srt")

            if os.path.exists(srt_filename):
                cleaned_text = clean_srt_to_text(srt_filename)
                outfile.write(f"\n--- Transcript for {video_id} ---\n{cleaned_text}\n")
            else:
                outfile.write(f"\n--- Transcript for {video_id} NOT FOUND ---\n")

        except Exception as e:
            outfile.write(f"\n--- Error fetching transcript for {video_id}: {str(e)} ---\n")
