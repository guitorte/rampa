import type { TranscriptSegment, VideoEntry } from '../types';

const API_BASE = '/api';

const SERVER_DOWN_MSG =
  'Servidor não está rodando. Execute "npm run server" no terminal.';

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

/**
 * Safely parse a fetch Response as JSON.
 * If the body isn't valid JSON (e.g. an HTML error page),
 * throw a clear error instead of a cryptic parse failure.
 */
async function safeJson<T>(res: Response, fallbackError: string): Promise<T> {
  const contentType = res.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    throw new Error(SERVER_DOWN_MSG);
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? fallbackError);
  }

  return data as T;
}

/**
 * Check whether the backend server is reachable.
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/transcript`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: '' }),
    });
    const ct = res.headers.get('content-type') ?? '';
    return ct.includes('application/json');
  } catch {
    return false;
  }
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

  return safeJson<TranscriptResponse>(res, 'Failed to fetch transcript');
}

export async function resolvePlaylist(url: string): Promise<PlaylistResponse> {
  const res = await fetch(`${API_BASE}/playlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  return safeJson<PlaylistResponse>(res, 'Failed to resolve playlist');
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

  return safeJson<BulkResponse>(res, 'Bulk fetch failed');
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

  return safeJson<ExportResponse>(res, 'Export failed');
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
