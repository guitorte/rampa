"""
Google Colab script to search files without extension in "/Google AI Studio" folder
Run this script in Google Colab to search inside files without extensions
"""

# Mount Google Drive
from google.colab import drive
drive.mount('/content/drive')

import os
import re
from pathlib import Path

# Configuration
DRIVE_FOLDER = '/content/drive/My Drive/Google AI Studio'
ENCODING = 'utf-8'

def find_files_without_extension(folder_path):
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
                    files_without_ext.append(full_path)
    except PermissionError as e:
        print(f"⚠️  Permission denied: {e}")

    return files_without_ext

def search_in_files(files, search_term, case_sensitive=False):
    """Search for a term in the content of files"""
    results = []
    flags = 0 if case_sensitive else re.IGNORECASE

    for file_path in files:
        try:
            with open(file_path, 'r', encoding=ENCODING, errors='ignore') as f:
                content = f.read()
                matches = re.finditer(search_term, content, flags)
                matches_list = list(matches)

                if matches_list:
                    # Get context around matches
                    lines = content.split('\n')
                    for match in matches_list:
                        # Find which line the match is on
                        pos = match.start()
                        line_num = content[:pos].count('\n') + 1
                        results.append({
                            'file': file_path,
                            'line': line_num,
                            'match': match.group(),
                            'position': pos
                        })
        except Exception as e:
            print(f"⚠️  Error reading {file_path}: {e}")

    return results

def display_results(results, limit=20):
    """Display search results in a readable format"""
    if not results:
        print("📭 No matches found")
        return

    print(f"✅ Found {len(results)} matches\n")
    print("=" * 80)

    for i, result in enumerate(results[:limit], 1):
        print(f"\n{i}. File: {result['file']}")
        print(f"   Line {result['line']}: {result['match']}")

    if len(results) > limit:
        print(f"\n... and {len(results) - limit} more matches")

# Main script
print("🔍 Google AI Studio File Search Tool")
print("=" * 80)
print(f"Searching in: {DRIVE_FOLDER}\n")

# Find files without extension
print("📂 Scanning for files without extension...")
files_without_ext = find_files_without_extension(DRIVE_FOLDER)

if files_without_ext:
    print(f"✅ Found {len(files_without_ext)} files without extension:\n")
    for file in files_without_ext[:10]:
        print(f"  • {file}")
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
    results = search_in_files(files_without_ext, search_term, case_sensitive)
    display_results(results)
    print("\n" + "-" * 80 + "\n")
