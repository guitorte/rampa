# 🎸🥁 Music Analysis Colab Notebook - Instructions

## Overview

This Google Colab notebook automatically analyzes any music track and generates detailed playing instructions for:
- **Guitar** (chords, progressions, strumming patterns, tabs)
- **Drums** (kick/snare/hi-hat patterns, fills, notation)
- **Melody** (if no guitar detected)

## 🚀 Quick Start

### Step 1: Open in Google Colab

1. Go to [Google Colab](https://colab.research.google.com)
2. Click **File → Upload notebook**
3. Upload the `Music_Analysis_Guitar_Drums_Instructor.ipynb` file
4. Or use this direct link if hosted on GitHub:
   - Click the "Open in Colab" badge (if added to the notebook)

### Step 2: Run the Notebook

1. **Run all cells** by clicking **Runtime → Run all**
2. When prompted, **upload your audio file** (MP3, WAV, M4A, etc.)
3. Wait for analysis (typically 3-5 minutes depending on song length)
4. **Download the generated ZIP file** containing:
   - Guitar playing guide (markdown)
   - Drums playing guide (markdown)

### Step 3: Use Your Guides

1. Extract the ZIP file
2. Open the `.md` files in any markdown reader or text editor
3. Follow the detailed instructions to learn the song!

---

## 📁 Using Files from Google Drive

If you want to analyze files from your Google Drive (e.g., your `00-restore` folder):

### Option A: Upload Directly
Just use the upload cell in Step 2 of the notebook.

### Option B: Mount Google Drive

1. In the notebook, find the cell with the commented-out Google Drive mounting code:
   ```python
   # from google.colab import drive
   # drive.mount('/content/drive')
   ```

2. Uncomment these lines (remove the `#`):
   ```python
   from google.colab import drive
   drive.mount('/content/drive')
   ```

3. Run the cell - you'll be asked to authorize Google Drive access

4. Set the path to your audio file:
   ```python
   audio_file = '/content/drive/MyDrive/00-restore/your_song.mp3'
   ```

5. Continue running the rest of the notebook!

---

## 🎵 What Gets Analyzed

### Full Track Analysis
- **Tempo** (BPM)
- **Key** (e.g., C Major, A Minor)
- **Time Signature** (e.g., 4/4, 3/4)
- **Duration**
- **Song Structure**

### Guitar Analysis
- Chord detection and progressions
- Chord timeline (when each chord plays)
- Most common chords
- Strumming patterns
- Capo suggestions
- Playing difficulty assessment
- If no guitar: Melody analysis instead

### Drum Analysis
- Kick drum patterns
- Snare drum patterns
- Hi-hat patterns
- Tempo and groove style
- Drum notation
- Practice routines
- Fill suggestions

---

## 📊 Technologies Used

The notebook uses these powerful audio analysis libraries:

- **Demucs** - AI-powered source separation (isolates drums, guitar, bass, vocals)
- **librosa** - Audio analysis and feature extraction
- **madmom** - Beat tracking and rhythm analysis
- **music21** - Music theory and notation
- **NumPy/SciPy** - Signal processing

---

## 📝 Output Format

You'll receive two detailed markdown guides:

### Guitar Guide Includes:
```
✅ Song overview (tempo, key, duration)
✅ Detected chords with frequency analysis
✅ Chord progression timeline
✅ Capo suggestions for easier playing
✅ Strumming/fingerpicking patterns
✅ Practice tips for all skill levels
✅ Music theory breakdown
```

### Drums Guide Includes:
```
✅ Song overview (tempo, time signature)
✅ Drum component breakdown (kick, snare, hi-hat)
✅ Groove style analysis
✅ Drum notation (standard format)
✅ Pattern breakdown by component
✅ Fill suggestions
✅ 4-week practice routine
✅ Tips for beginners and advanced players
```

---

## 💡 Tips for Best Results

### Audio Quality
- **Higher quality = better analysis**
- Use WAV or high-bitrate MP3 (320kbps) when possible
- Avoid heavily compressed or low-quality audio

### Song Types
- Works best with: Rock, Pop, Folk, Country, Jazz
- May struggle with: Heavy metal, experimental, very electronic music
- Drums: Best with acoustic drums; programmed drums may vary

### Analysis Duration
- Analyzes first 2-3 minutes by default (adjustable in code)
- Longer songs take more processing time
- Consider analyzing just the main section if song is very long

---

## 🔧 Customization Options

You can modify the notebook for your needs:

### Change Analysis Duration
In the analysis cells, look for:
```python
y, sr = librosa.load(audio_file, duration=180)  # 180 seconds = 3 minutes
```
Change `180` to analyze more or less of the song.

### Adjust Chord Detection Sensitivity
Find the chord detection section and adjust:
```python
segment_length = int(2 * sr_guitar / hop_length)  # 2-second windows
```
Decrease for faster chord changes, increase for slower songs.

### Export Separated Tracks
Uncomment these lines in Step 9:
```python
# zipf.write(drums_file, 'separated_drums.wav')
# zipf.write(guitar_file, 'separated_guitar.wav')
```

This will include the isolated drum and guitar tracks in your download!

---

## 🎯 Example Workflow

Let's say you want to learn "Emi Grace - Known Better":

1. **Upload** the MP3 to the notebook
2. **Wait** 3-5 minutes for analysis
3. **Download** the ZIP file
4. **Open** `Emi_Grace_Known_Better_GUITAR_GUIDE.md`
5. **Learn** the chords: A#, F#, G# (or use capo 3 for easier G, E, D)
6. **Practice** strumming pattern at 96 BPM
7. **Open** `Emi_Grace_Known_Better_DRUMS_GUIDE.md`
8. **Learn** the basic kick/snare pattern
9. **Add** hi-hats for full groove
10. **Rock out!** 🎸🥁

---

## ❓ Troubleshooting

### "No module named 'demucs'"
- Make sure you ran the first cell (Step 1) that installs dependencies
- Restart runtime and try again

### "File not found"
- Check your file path is correct
- If using Google Drive, make sure it's mounted properly

### "Analysis taking too long"
- Source separation is computationally intensive (normal: 2-5 minutes)
- Consider using a shorter audio clip
- Ensure you're using a GPU runtime: **Runtime → Change runtime type → GPU**

### "Chords seem wrong"
- Automatic chord detection is ~70-80% accurate
- Use your ear to verify and adjust
- Works better with cleaner mixes

### "No guitar/drums detected"
- The track may not have prominent guitar/drums
- Try adjusting detection thresholds in the code
- Some genres (electronic, orchestral) may not work well

---

## 🚀 Advanced Usage

### Batch Processing Multiple Songs

Modify the notebook to loop through multiple files:

```python
audio_files = ['song1.mp3', 'song2.mp3', 'song3.mp3']

for audio_file in audio_files:
    # Run analysis code here
    # Save outputs with unique names
```

### Integration with Claude

After analysis, you can:
1. Download the markdown guides
2. Share them with Claude for further questions
3. Ask Claude to:
   - Explain difficult chord transitions
   - Suggest simplified versions
   - Create tab notation
   - Generate practice exercises
   - Transpose to different keys

### Export to Other Formats

Add cells to convert markdown to:
- **PDF** using `markdown2pdf`
- **HTML** using `markdown2`
- **Plain text** for printing

---

## 📚 Learning Resources

After getting your guides:

- **For Guitar:**
  - Practice chord shapes on [ChordBank](https://chordbank.com)
  - Use [Ultimate Guitar](https://ultimate-guitar.com) for community tabs
  - Watch technique videos on YouTube

- **For Drums:**
  - Practice patterns on [Drumeo](https://drumeo.com)
  - Use drum notation apps like Drum Guru
  - Play along with [Drumless tracks](https://youtube.com/drumlesstracks)

---

## 🎁 What to Give Back to Claude

If you want to help Claude analyze songs better in the future, you can provide:

### Option 1: The Generated Guides
Just share the markdown files! They contain all the analysis in a clean, readable format.

### Option 2: Analysis JSON (Advanced)
Add this cell to the notebook to export raw analysis data:

```python
import json

analysis_data = {
    'track_info': track_info,
    'guitar_analysis': guitar_analysis,
    'drums_analysis': drums_analysis
}

with open('analysis_data.json', 'w') as f:
    json.dump(analysis_data, f, indent=2, default=str)

files.download('analysis_data.json')
```

This gives Claude the raw data to work with!

### Option 3: Corrections/Feedback
If you notice errors in the analysis:
- Note which chords were wrong
- Specify the correct chords
- Share timing corrections
- This helps improve future analyses!

---

## 📞 Need Help?

If you run into issues:
1. Check the troubleshooting section above
2. Read the error messages carefully
3. Try restarting the runtime
4. Ask Claude for help with specific errors!

---

## 🎵 Happy Learning!

Remember:
- **Start slow** - Use metronome at 60-70% speed
- **Be patient** - Learning takes time
- **Have fun** - Music is about enjoyment!
- **Practice daily** - Even 15 minutes helps

Now go make some music! 🎸🥁🎹🎤

---

*Last updated: January 2026*
*Compatible with: Google Colab, Python 3.8+*
