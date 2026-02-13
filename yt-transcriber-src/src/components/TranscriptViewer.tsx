import { useState } from 'react';
import { Clock, AlignLeft, Copy, Check } from 'lucide-react';
import type { VideoEntry } from '../types';

interface TranscriptViewerProps {
  video: VideoEntry;
}

type ViewMode = 'plain' | 'timestamped';

export default function TranscriptViewer({ video }: TranscriptViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('plain');
  const [copied, setCopied] = useState(false);

  if (!video.transcript || video.transcript.length === 0) {
    return (
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-8 text-center">
        <p className="text-[var(--text-secondary)] text-sm">
          Selecione um vídeo com transcrição para visualizar.
        </p>
      </div>
    );
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

  function getPlainText(): string {
    return video.transcript!.map((s) => s.text).join(' ');
  }

  function getTimestampedText(): string {
    return video.transcript!
      .map((s) => `[${formatTimestamp(s.offset)}] ${s.text}`)
      .join('\n');
  }

  async function handleCopy() {
    const text = viewMode === 'plain' ? getPlainText() : getTimestampedText();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {video.title}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {video.transcript.length} segmentos
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* View mode toggle */}
          <div className="flex bg-[var(--bg-tertiary)] rounded-md">
            <button
              onClick={() => setViewMode('plain')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'plain'
                  ? 'bg-red-600 text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Texto corrido"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('timestamped')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'timestamped'
                  ? 'bg-red-600 text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Com timestamps"
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-tertiary)] hover:bg-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium rounded-md transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {viewMode === 'plain' ? (
          <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
            {getPlainText()}
          </p>
        ) : (
          <div className="space-y-1">
            {video.transcript.map((segment, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="text-red-400 font-mono text-xs pt-0.5 flex-shrink-0 w-16 text-right">
                  {formatTimestamp(segment.offset)}
                </span>
                <span className="text-[var(--text-primary)] leading-relaxed">
                  {segment.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
