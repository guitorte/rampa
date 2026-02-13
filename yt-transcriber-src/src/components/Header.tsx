import { Youtube } from 'lucide-react';

interface HeaderProps {
  videoCount: number;
  doneCount: number;
}

export default function Header({ videoCount, doneCount }: HeaderProps) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg">
            <Youtube className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              YT Transcriber
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Extrator de Transcrições do YouTube
            </p>
          </div>
        </div>

        {videoCount > 0 && (
          <div className="text-sm text-[var(--text-secondary)]">
            <span className="text-[var(--accent-light)] font-medium">{doneCount}</span>
            {' / '}
            <span>{videoCount}</span>
            {' transcrições'}
          </div>
        )}
      </div>
    </header>
  );
}
