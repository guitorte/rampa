"""
Google Colab script to search files without extension in "/Google AI Studio" folder
OPTIMIZED for 1000+ files with parallel processing and progress tracking
Run this script in Google Colab to search inside files without extensions
"""

# Mount Google Drive
from google.colab import drive
drive.mount('/content/drive')

import os
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed, TimeoutError
from tqdm import tqdm

# Configuration
DRIVE_FOLDER = '/content/drive/My Drive/Google AI Studio'
ENCODING = 'utf-8'
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB - skip larger files
MAX_READ_SIZE = 10 * 1024 * 1024  # 10MB - max to read per file
NUM_WORKERS = 2  # Reduced from 4 for stability
TIMEOUT_PER_FILE = 5  # seconds

print("✅ Google Drive mounted!")
print(f"⚙️  Configuration:")
print(f"   - Workers: {NUM_WORKERS}")
print(f"   - Max file size: {MAX_FILE_SIZE / (1024*1024):.0f}MB")
print(f"   - Max read size: {MAX_READ_SIZE / (1024*1024):.0f}MB")
print(f"   - Timeout per file: {TIMEOUT_PER_FILE}s\n")

def find_files_without_extension(folder_path, max_size=MAX_FILE_SIZE):
    """Find all files without extension in the specified folder and subfolders"""
    files_without_ext = []

    if not os.path.exists(folder_path):
        print(f"❌ Folder not found: {folder_path}")
        return files_without_ext

    try:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                # Check if file has no extension (no dot in filename, or dot is at the start)
                if '.' not in file or file.startswith('.'):
                    full_path = os.path.join(root, file)
                    try:
                        file_size = os.path.getsize(full_path)
                        # Skip files that are too large (likely binary)
                        if file_size <= max_size:
                            files_without_ext.append((full_path, file_size))
                    except (OSError, PermissionError):
                        pass
    except PermissionError as e:
        print(f"⚠️  Permission denied: {e}")

    # Sort by file size (smaller files first for faster initial results)
    files_without_ext.sort(key=lambda x: x[1])
    return [f[0] for f in files_without_ext]

def search_in_file(file_path, search_term, case_sensitive=False, flags=0, max_read=MAX_READ_SIZE):
    """Search for a term in a single file with size protection"""
    results = []

    try:
        # Check file size first
        file_size = os.path.getsize(file_path)
        if file_size > max_read:
            return []  # Skip very large files

        with open(file_path, 'r', encoding=ENCODING, errors='ignore') as f:
            # Read with size limit to prevent memory issues
            content = f.read(max_read)

            try:
                matches = list(re.finditer(search_term, content, flags))
            except re.error as e:
                return [(file_path, 0, f'❌ Regex error: {e}', '', 0)]

            if matches:
                lines = content.split('\n')
                for match in matches:
                    pos = match.start()
                    line_num = content[:pos].count('\n') + 1
                    line_content = lines[line_num - 1] if line_num <= len(lines) else ""

                    results.append((file_path, line_num, match.group(), line_content, pos))
    except Exception:
        pass  # Silently skip files that can't be read

    return results

def search_in_files_parallel(files, search_term, case_sensitive=False, num_workers=NUM_WORKERS, timeout_per_file=TIMEOUT_PER_FILE):
    """Search for a term in files using parallel processing with timeout protection"""
    results = []
    flags = 0 if case_sensitive else re.IGNORECASE
    skipped_count = 0
    timeout_count = 0

    with ThreadPoolExecutor(max_workers=num_workers) as executor:
        # Submit all tasks
        futures = {
            executor.submit(search_in_file, file_path, search_term, case_sensitive, flags): file_path
            for file_path in files
        }

        # Collect results with progress bar
        with tqdm(total=len(files), desc="🔍 Searching", unit="file") as pbar:
            for future in as_completed(futures, timeout=timeout_per_file + 2):
                file_path = futures[future]
                try:
                    file_results = future.result(timeout=timeout_per_file)
                    results.extend(file_results)
                except TimeoutError:
                    timeout_count += 1
                    pbar.write(f"⏱️  Timeout: {file_path.split('/')[-1]}")
                except Exception:
                    skipped_count += 1
                pbar.update(1)

    if timeout_count > 0 or skipped_count > 0:
        print(f"\n⚠️  Timeouts: {timeout_count} | Skipped: {skipped_count}")

    return results

def display_results(results, limit=20):
    """Display search results in a readable format"""
    if not results:
        print("📭 No matches found")
        return

    print(f"✅ Found {len(results)} matches\n")
    print("=" * 80)

    for i, (file_path, line_num, match, line_content, pos) in enumerate(results[:limit], 1):
        print(f"\n{i}. File: {file_path}")
        print(f"   Line {line_num}: {match}")
        if line_content:
            context = line_content[:80]
            if len(line_content) > 80:
                context += "..."
            print(f"   Context: {context}")

    if len(results) > limit:
        print(f"\n... and {len(results) - limit} more matches")

# Main script
print("🔍 Google AI Studio File Search Tool (Optimized)")
print("=" * 80)
print(f"Searching in: {DRIVE_FOLDER}\n")

# Find files without extension
print("📂 Scanning for files without extension...")
start_time = time.time()
files_without_ext = find_files_without_extension(DRIVE_FOLDER)
scan_time = time.time() - start_time

if files_without_ext:
    total_size = sum(os.path.getsize(f) for f in files_without_ext if os.path.exists(f)) / (1024*1024)
    print(f"✅ Found {len(files_without_ext)} files ({total_size:.1f}MB) in {scan_time:.2f}s\n")
    print("Sample files:")
    for file in files_without_ext[:10]:
        if os.path.exists(file):
            size = os.path.getsize(file) / 1024
            print(f"  • {file} ({size:.1f}KB)")
    if len(files_without_ext) > 10:
        print(f"  ... and {len(files_without_ext) - 10} more")
else:
    print("📭 No files without extension found")

# Interactive search
print("\n" + "=" * 80)
print("\n🔎 Search in these files:")
print("(Enter your search term or 'quit' to exit)\n")

while True:
    search_term = input("Search term: ").strip()

    if search_term.lower() == 'quit':
        print("\n👋 Goodbye!")
        break

    if not search_term:
        print("⚠️  Please enter a search term\n")
        continue

    case_sensitive = input("Case sensitive? (y/n): ").lower() == 'y'

    print(f"\n🔍 Searching for '{search_term}'...\n")
    start_time = time.time()
    results = search_in_files_parallel(files_without_ext, search_term, case_sensitive, num_workers=2)
    search_time = time.time() - start_time

    print(f"\n✅ Found {len(results)} matches in {search_time:.2f}s")
    if search_time > 0:
        print(f"Searched {len(files_without_ext)} files at ~{len(files_without_ext)/search_time:.0f} files/second\n")

    display_results(results, limit=20)
    print("\n" + "-" * 80 + "\n")
