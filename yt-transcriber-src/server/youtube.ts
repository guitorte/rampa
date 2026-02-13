import { YoutubeTranscript } from 'youtube-transcript';
import ytpl from 'ytpl';

export interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
}

export interface VideoInfo {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  duration?: string;
}

export interface TranscriptResult {
  videoId: string;
  title: string;
  language: string;
  segments: TranscriptSegment[];
}

/**
 * Extract video ID from various YouTube URL formats
 */
export function extractVideoId(input: string): string | null {
  const trimmed = input.trim();

  // Already a plain video ID (11 chars alphanumeric + dash/underscore)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const hostname = url.hostname.replace('www.', '');

    // youtube.com/watch?v=ID
    if ((hostname === 'youtube.com' || hostname === 'm.youtube.com') && url.pathname === '/watch') {
      return url.searchParams.get('v');
    }

    // youtube.com/embed/ID or youtube.com/v/ID
    if (hostname === 'youtube.com') {
      const match = url.pathname.match(/^\/(embed|v)\/([a-zA-Z0-9_-]{11})/);
      if (match) return match[2];
    }

    // youtu.be/ID
    if (hostname === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }

    // youtube.com/shorts/ID
    if (hostname === 'youtube.com') {
      const shortsMatch = url.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shortsMatch) return shortsMatch[1];
    }
  } catch {
    // Not a valid URL
  }

  return null;
}

/**
 * Check if a URL is a YouTube playlist
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
 * Resolve a playlist URL to a list of video infos
 */
export async function resolvePlaylist(playlistUrl: string): Promise<VideoInfo[]> {
  const result = await ytpl(playlistUrl, { limit: Infinity });

  return result.items.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.shortUrl,
    thumbnail: item.bestThumbnail?.url ?? undefined,
    duration: item.duration ?? undefined,
  }));
}

/**
 * Fetch transcript for a single video
 */
export async function fetchTranscript(
  videoIdOrUrl: string,
  lang?: string
): Promise<TranscriptResult> {
  const videoId = extractVideoId(videoIdOrUrl) ?? videoIdOrUrl;

  const config: { lang?: string } = {};
  if (lang) config.lang = lang;

  const segments = await YoutubeTranscript.fetchTranscript(videoId, config);

  return {
    videoId,
    title: '',  // Will be populated by the caller if needed
    language: lang ?? 'auto',
    segments: segments.map((s) => ({
      text: s.text,
      offset: s.offset,
      duration: s.duration,
    })),
  };
}

/**
 * Format transcript segments as plain text
 */
export function formatAsText(segments: TranscriptSegment[]): string {
  return segments.map((s) => s.text).join(' ');
}

/**
 * Format transcript segments as SRT subtitles
 */
export function formatAsSrt(segments: TranscriptSegment[]): string {
  return segments
    .map((s, i) => {
      const startTime = formatSrtTime(s.offset);
      const endTime = formatSrtTime(s.offset + s.duration);
      return `${i + 1}\n${startTime} --> ${endTime}\n${s.text}\n`;
    })
    .join('\n');
}

function formatSrtTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor(ms % 1000);

  return (
    String(hours).padStart(2, '0') +
    ':' +
    String(minutes).padStart(2, '0') +
    ':' +
    String(seconds).padStart(2, '0') +
    ',' +
    String(milliseconds).padStart(3, '0')
  );
}

/**
 * Format transcript segments as timestamped text
 */
export function formatAsTimestamped(segments: TranscriptSegment[]): string {
  return segments
    .map((s) => {
      const time = formatTimestamp(s.offset);
      return `[${time}] ${s.text}`;
    })
    .join('\n');
}

function formatTimestamp(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
