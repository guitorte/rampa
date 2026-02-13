import { useState } from 'react';
import { Download, FileText, Subtitles, Clock, Braces } from 'lucide-react';
import type { VideoEntry, ExportFormat } from '../types';
import { exportTranscript } from '../services/api';

interface ExportPanelProps {
  videos: VideoEntry[];
  selectedId: string | null;
}

const FORMAT_OPTIONS: { value: ExportFormat; label: string; icon: typeof FileText; desc: string }[] = [
  { value: 'text', label: 'Texto', icon: FileText, desc: 'Texto corrido sem timestamps' },
  { value: 'timestamped', label: 'Timestamped', icon: Clock, desc: 'Texto com marcações de tempo' },
  { value: 'srt', label: 'SRT', icon: Subtitles, desc: 'Formato de legenda padrão' },
  { value: 'json', label: 'JSON', icon: Braces, desc: 'Dados estruturados completos' },
];

export default function ExportPanel({ videos, selectedId }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>('text');
  const [scope, setScope] = useState<'selected' | 'all'>('selected');
  const [isExporting, setIsExporting] = useState(false);

  const doneVideos = videos.filter((v) => v.status === 'done' && v.transcript);
  const selectedVideo = videos.find((v) => v.id === selectedId);
  const canExportSelected = selectedVideo?.status === 'done' && selectedVideo.transcript;

  if (doneVideos.length === 0) return null;

  async function handleExport() {
    setIsExporting(true);

    try {
      const videosToExport = scope === 'all'
        ? doneVideos
        : canExportSelected
          ? [selectedVideo!]
          : [];

      for (const video of videosToExport) {
        if (!video.transcript) continue;

        const result = await exportTranscript(video.transcript, format);

        // Create download
        const blob = new Blob([result.content], { type: result.contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const safeTitle = video.title
          .replace(/[^a-zA-Z0-9\u00C0-\u024F\s_-]/g, '')
          .replace(/\s+/g, '_')
          .slice(0, 60);
        const ext = format === 'json' ? 'json' : format === 'srt' ? 'srt' : 'txt';
        a.download = `${safeTitle}.${ext}`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-5">
      <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
        Exportar Transcrições
      </h2>

      {/* Format selection */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {FORMAT_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => setFormat(opt.value)}
              className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                format === opt.value
                  ? 'border-red-500/50 bg-red-500/10 text-[var(--text-primary)]'
                  : 'border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <div>
                <div className="text-xs font-medium">{opt.label}</div>
                <div className="text-[10px] opacity-60">{opt.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Scope selection */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setScope('selected')}
          disabled={!canExportSelected}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
            scope === 'selected'
              ? 'bg-red-600 text-white'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          Vídeo selecionado
        </button>
        <button
          onClick={() => setScope('all')}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
            scope === 'all'
              ? 'bg-red-600 text-white'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Todos ({doneVideos.length})
        </button>
      </div>

      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={isExporting || (scope === 'selected' && !canExportSelected)}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Download className="w-4 h-4" />
        {isExporting ? 'Exportando...' : 'Baixar'}
      </button>
    </div>
  );
}
