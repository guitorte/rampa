import { Loader2, CheckCircle2, AlertCircle, FileText, Trash2, RotateCcw } from 'lucide-react';
import type { VideoEntry } from '../types';

interface VideoCardProps {
  video: VideoEntry;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onRetry: () => void;
}

export default function VideoCard({ video, isSelected, onSelect, onRemove, onRetry }: VideoCardProps) {
  const statusIcon = {
    pending: <FileText className="w-4 h-4 text-[var(--text-secondary)]" />,
    loading: <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />,
    done: <CheckCircle2 className="w-4 h-4 text-green-400" />,
    error: <AlertCircle className="w-4 h-4 text-red-400" />,
  };

  const statusLabel = {
    pending: 'Aguardando',
    loading: 'Baixando...',
    done: `${video.transcript?.length ?? 0} segmentos`,
    error: video.error ?? 'Erro',
  };

  return (
    <div
      onClick={video.status === 'done' ? onSelect : undefined}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
        isSelected
          ? 'border-red-500/50 bg-red-500/10'
          : 'border-[var(--border)] bg-[var(--bg-tertiary)] hover:border-[var(--border)]/80'
      } ${video.status === 'done' ? 'cursor-pointer' : ''}`}
    >
      {/* Thumbnail */}
      {video.thumbnail ? (
        <img
          src={video.thumbnail}
          alt=""
          className="w-20 h-12 rounded object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-20 h-12 rounded bg-[var(--bg-primary)] flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-[var(--text-secondary)]" />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
          {video.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {statusIcon[video.status]}
          <span className={`text-xs ${
            video.status === 'error' ? 'text-red-400' : 'text-[var(--text-secondary)]'
          }`}>
            {statusLabel[video.status]}
          </span>
          {video.duration && (
            <span className="text-xs text-[var(--text-secondary)]">
              &middot; {video.duration}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {video.status === 'error' && (
          <button
            onClick={(e) => { e.stopPropagation(); onRetry(); }}
            className="p-1.5 rounded-md hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-yellow-400 transition-colors"
            title="Tentar novamente"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-1.5 rounded-md hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-red-400 transition-colors"
          title="Remover"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
