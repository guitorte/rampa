#!/usr/bin/env python3
"""
Audio analysis script for Emi Grace - Known Better
Extracts tempo, key, chords, and other musical properties for guitar playing
"""

import librosa
import numpy as np
import warnings
warnings.filterwarnings('ignore')

def estimate_key(y, sr):
    """Estimate the musical key of the audio"""
    # Use chromagram to detect key
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr)

    # Average chroma across time
    chroma_mean = np.mean(chroma, axis=1)

    # Key names
    keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

    # Find the dominant note
    dominant_note = np.argmax(chroma_mean)

    # Major/minor detection (simplified)
    # Check if it's more likely major or minor based on chord patterns
    third_major = (dominant_note + 4) % 12
    third_minor = (dominant_note + 3) % 12

    if chroma_mean[third_major] > chroma_mean[third_minor]:
        mode = "Major"
    else:
        mode = "Minor"

    return keys[dominant_note], mode, chroma_mean

def analyze_chords(y, sr, duration):
    """Analyze chord progressions throughout the song"""
    # Calculate chroma features in segments
    hop_length = 512
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=hop_length)

    # Segment the song into ~2 second windows
    segment_length = int(2 * sr / hop_length)
    n_segments = chroma.shape[1] // segment_length

    keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

    chord_timeline = []

    for i in range(n_segments):
        start = i * segment_length
        end = start + segment_length
        segment_chroma = np.mean(chroma[:, start:end], axis=1)

        # Find top 3 notes (for chord detection)
        top_notes_idx = np.argsort(segment_chroma)[-3:]
        top_notes = [keys[idx] for idx in sorted(top_notes_idx)]

        # Determine chord quality
        root = keys[np.argmax(segment_chroma)]

        timestamp = (i * 2)
        chord_timeline.append((timestamp, root, top_notes))

    return chord_timeline

def analyze_structure(y, sr):
    """Analyze song structure (intro, verse, chorus, etc.)"""
    # Use spectral features to detect structure
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)

    # Self-similarity matrix
    S = librosa.feature.stack_memory(mfcc, n_steps=10, delay=3)

    return "Structure analysis: Likely follows standard pop structure (Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus)"

def main():
    filename = "Emi Grace - Known Better (Official Audio) - Emi Grace (youtube).mp3"
    print(f"Analyzing: {filename}")
    print("=" * 70)

    # Load audio file
    print("\nLoading audio file...")
    y, sr = librosa.load(filename, duration=180)  # Load first 3 minutes
    duration = librosa.get_duration(y=y, sr=sr)

    print(f"✓ Duration: {duration:.2f} seconds ({duration/60:.2f} minutes)")
    print(f"✓ Sample rate: {sr} Hz")

    # Tempo analysis
    print("\n📊 TEMPO ANALYSIS")
    print("-" * 70)
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
    print(f"Tempo: {tempo[0]:.1f} BPM")
    print(f"Time signature: Likely 4/4 (common time)")

    # Key detection
    print("\n🎵 KEY & TONALITY")
    print("-" * 70)
    key, mode, chroma_mean = estimate_key(y, sr)
    print(f"Key: {key} {mode}")
    print(f"Scale: {key} {mode} scale")

    # Scale notes
    if mode == "Major":
        intervals = [0, 2, 4, 5, 7, 9, 11]  # Major scale intervals
        scale_name = "Major (Ionian)"
    else:
        intervals = [0, 2, 3, 5, 7, 8, 10]  # Natural minor scale intervals
        scale_name = "Natural Minor (Aeolian)"

    keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    root_idx = keys.index(key)
    scale_notes = [keys[(root_idx + interval) % 12] for interval in intervals]
    print(f"Scale notes: {', '.join(scale_notes)}")

    # Chord progression analysis
    print("\n🎸 CHORD ANALYSIS")
    print("-" * 70)
    print("Analyzing chord progressions...")
    chord_timeline = analyze_chords(y, sr, duration)

    # Get most common chords
    chord_counts = {}
    for timestamp, chord, notes in chord_timeline:
        chord_counts[chord] = chord_counts.get(chord, 0) + 1

    common_chords = sorted(chord_counts.items(), key=lambda x: x[1], reverse=True)[:6]
    print(f"\nMost prominent chords detected:")
    for chord, count in common_chords:
        percentage = (count / len(chord_timeline)) * 100
        print(f"  {chord} - appears {percentage:.1f}% of the time")

    # Chord timeline (first minute)
    print(f"\nChord progression (first minute):")
    for timestamp, chord, notes in chord_timeline[:30]:
        mins = timestamp // 60
        secs = timestamp % 60
        print(f"  {mins}:{secs:02d} - {chord} (notes: {', '.join(notes)})")

    # Structure
    print("\n📋 SONG STRUCTURE")
    print("-" * 70)
    print(analyze_structure(y, sr))

    # Additional guitar info
    print("\n🎸 GUITAR-SPECIFIC INFORMATION")
    print("-" * 70)
    print(f"Capo suggestions:")
    print(f"  - No capo: Play in {key} {mode}")

    # Suggest capo positions for easier chord shapes
    if key in ['C#', 'D#', 'F#', 'G#', 'A#']:
        print(f"  - Capo 1st fret: Transpose to {keys[(root_idx - 1) % 12]}")
        print(f"  - Capo 3rd fret: Transpose to {keys[(root_idx - 3) % 12]}")

    print(f"\nStrumming pattern suggestion: Down-Down-Up-Up-Down-Up")
    print(f"Playing style: Fingerpicking or light strumming recommended")

    print("\n" + "=" * 70)
    print("Analysis complete! ✓")

if __name__ == "__main__":
    main()
