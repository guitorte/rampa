import { Play, Trash2 } from 'lucide-react';
import type { VideoEntry } from '../types';
import VideoCard from './VideoCard';

interface VideoListProps {
  videos: VideoEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
  onFetchAll: () => void;
  onClearAll: () => void;
}

export default function VideoList({
  videos,
  selectedId,
  onSelect,
  onRemove,
  onRetry,
  onFetchAll,
  onClearAll,
}: VideoListProps) {
  if (videos.length === 0) return null;

  const pendingCount = videos.filter((v) => v.status === 'pending').length;
  const hasAny = videos.length > 0;

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
          Vídeos ({videos.length})
        </h2>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <button
              onClick={onFetchAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors"
            >
              <Play className="w-3 h-3" />
              Buscar Todas ({pendingCount})
            </button>
          )}
          {hasAny && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-tertiary)] hover:bg-red-600/20 text-[var(--text-secondary)] hover:text-red-400 text-xs font-medium rounded-md transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Video cards */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            isSelected={selectedId === video.id}
            onSelect={() => onSelect(video.id)}
            onRemove={() => onRemove(video.id)}
            onRetry={() => onRetry(video.id)}
          />
        ))}
      </div>
    </div>
  );
}
