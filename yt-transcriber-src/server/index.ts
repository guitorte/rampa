import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  extractVideoId,
  isPlaylistUrl,
  resolvePlaylist,
  fetchTranscript,
  formatAsText,
  formatAsSrt,
  formatAsTimestamped,
} from './youtube.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ?? 3131;

app.use(cors());
app.use(express.json());

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.resolve(__dirname, '..', 'yt-transcriber');
  app.use(express.static(clientPath));
}

/**
 * POST /api/transcript
 * Fetch transcript for a single video
 * Body: { url: string, lang?: string }
 */
app.post('/api/transcript', async (req, res) => {
  try {
    const { url, lang } = req.body as { url: string; lang?: string };

    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      res.status(400).json({ error: 'Invalid YouTube URL or video ID' });
      return;
    }

    const result = await fetchTranscript(videoId, lang);
    result.videoId = videoId;

    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch transcript';
    res.status(500).json({ error: message });
  }
});

/**
 * POST /api/playlist
 * Resolve a playlist URL to list of videos
 * Body: { url: string }
 */
app.post('/api/playlist', async (req, res) => {
  try {
    const { url } = req.body as { url: string };

    if (!url) {
      res.status(400).json({ error: 'Playlist URL is required' });
      return;
    }

    if (!isPlaylistUrl(url)) {
      res.status(400).json({ error: 'Not a valid playlist URL' });
      return;
    }

    const videos = await resolvePlaylist(url);
    res.json({ videos, count: videos.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to resolve playlist';
    res.status(500).json({ error: message });
  }
});

/**
 * POST /api/bulk
 * Fetch transcripts for multiple videos
 * Body: { urls: string[], lang?: string }
 */
app.post('/api/bulk', async (req, res) => {
  try {
    const { urls, lang } = req.body as { urls: string[]; lang?: string };

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      res.status(400).json({ error: 'Array of URLs is required' });
      return;
    }

    if (urls.length > 50) {
      res.status(400).json({ error: 'Maximum 50 videos per request' });
      return;
    }

    const results = await Promise.allSettled(
      urls.map(async (url) => {
        const videoId = extractVideoId(url);
        if (!videoId) throw new Error(`Invalid URL: ${url}`);
        const result = await fetchTranscript(videoId, lang);
        result.videoId = videoId;
        return result;
      })
    );

    const transcripts = results.map((r, i) => {
      if (r.status === 'fulfilled') {
        return { success: true, data: r.value };
      }
      return {
        success: false,
        url: urls[i],
        error: r.reason instanceof Error ? r.reason.message : 'Unknown error',
      };
    });

    res.json({ transcripts });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bulk operation failed';
    res.status(500).json({ error: message });
  }
});

/**
 * POST /api/export
 * Export transcript in specified format
 * Body: { segments: TranscriptSegment[], format: 'text' | 'srt' | 'timestamped' | 'json' }
 */
app.post('/api/export', (req, res) => {
  try {
    const { segments, format } = req.body as {
      segments: Array<{ text: string; offset: number; duration: number }>;
      format: string;
    };

    if (!segments || !Array.isArray(segments)) {
      res.status(400).json({ error: 'Segments array is required' });
      return;
    }

    let content: string;
    let filename: string;
    let contentType: string;

    switch (format) {
      case 'srt':
        content = formatAsSrt(segments);
        filename = 'transcript.srt';
        contentType = 'text/srt';
        break;
      case 'timestamped':
        content = formatAsTimestamped(segments);
        filename = 'transcript.txt';
        contentType = 'text/plain';
        break;
      case 'json':
        content = JSON.stringify(segments, null, 2);
        filename = 'transcript.json';
        contentType = 'application/json';
        break;
      case 'text':
      default:
        content = formatAsText(segments);
        filename = 'transcript.txt';
        contentType = 'text/plain';
        break;
    }

    res.json({ content, filename, contentType });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Export failed';
    res.status(500).json({ error: message });
  }
});

// SPA fallback for production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (_req, res) => {
    const clientPath = path.resolve(__dirname, '..', 'yt-transcriber', 'index.html');
    res.sendFile(clientPath);
  });
}

app.listen(PORT, () => {
  console.log(`YT Transcriber server running on http://localhost:${PORT}`);
});
