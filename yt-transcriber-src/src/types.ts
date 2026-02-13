export interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
}

export interface VideoEntry {
  id: string;
  url: string;
  title: string;
  thumbnail?: string;
  duration?: string;
  status: 'pending' | 'loading' | 'done' | 'error';
  error?: string;
  transcript?: TranscriptSegment[];
  language?: string;
}

export type ExportFormat = 'text' | 'srt' | 'timestamped' | 'json';
