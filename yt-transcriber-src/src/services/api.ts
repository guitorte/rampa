import type { TranscriptSegment, VideoEntry } from '../types';

const API_BASE = '/api';

interface TranscriptResponse {
  videoId: string;
  title: string;
  language: string;
  segments: TranscriptSegment[];
}

interface PlaylistResponse {
  videos: Array<{
    id: string;
    title: string;
    url: string;
    thumbnail?: string;
    duration?: string;
  }>;
  count: number;
}

interface BulkResult {
  success: boolean;
  data?: TranscriptResponse;
  url?: string;
  error?: string;
}

interface BulkResponse {
  transcripts: BulkResult[];
}

interface ExportResponse {
  content: string;
  filename: string;
  contentType: string;
}

export async function fetchTranscript(
  url: string,
  lang?: string
): Promise<TranscriptResponse> {
  const res = await fetch(`${API_BASE}/transcript`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, lang }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Failed to fetch transcript');
  }

  return res.json();
}

export async function resolvePlaylist(url: string): Promise<PlaylistResponse> {
  const res = await fetch(`${API_BASE}/playlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Failed to resolve playlist');
  }

  return res.json();
}

export async function fetchBulkTranscripts(
  urls: string[],
  lang?: string
): Promise<BulkResponse> {
  const res = await fetch(`${API_BASE}/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls, lang }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Bulk fetch failed');
  }

  return res.json();
}

export async function exportTranscript(
  segments: TranscriptSegment[],
  format: string
): Promise<ExportResponse> {
  const res = await fetch(`${API_BASE}/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ segments, format }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Export failed');
  }

  return res.json();
}

/**
 * Extract video ID from a YouTube URL (client-side utility)
 */
export function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const hostname = url.hostname.replace('www.', '');

    if ((hostname === 'youtube.com' || hostname === 'm.youtube.com') && url.pathname === '/watch') {
      return url.searchParams.get('v');
    }
    if (hostname === 'youtube.com') {
      const match = url.pathname.match(/^\/(embed|v|shorts)\/([a-zA-Z0-9_-]{11})/);
      if (match) return match[2];
    }
    if (hostname === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
  } catch { /* not a URL */ }

  return null;
}

/**
 * Check if input looks like a playlist URL
 */
export function isPlaylistUrl(input: string): boolean {
  try {
    const url = new URL(input.trim());
    return url.searchParams.has('list') || url.pathname.includes('/playlist');
  } catch {
    return false;
  }
}

/**
 * Parse a multi-line input into individual video entries
 */
export function parseVideoUrls(input: string): Omit<VideoEntry, 'status'>[] {
  const lines = input
    .split(/[\n,]/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const entries: Omit<VideoEntry, 'status'>[] = [];

  for (const line of lines) {
    const videoId = extractVideoId(line);
    if (videoId) {
      entries.push({
        id: videoId,
        url: line,
        title: `Video ${videoId}`,
      });
    }
  }

  return entries;
}
