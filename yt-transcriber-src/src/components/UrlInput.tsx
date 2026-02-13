import { useState } from 'react';
import { Plus, ListVideo, Loader2, Link } from 'lucide-react';

interface UrlInputProps {
  onAddVideos: (urls: string[]) => void;
  onAddPlaylist: (url: string) => void;
  isProcessing: boolean;
}

export default function UrlInput({ onAddVideos, onAddPlaylist, isProcessing }: UrlInputProps) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'videos' | 'playlist'>('videos');

  function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (mode === 'playlist') {
      onAddPlaylist(trimmed);
    } else {
      const urls = trimmed
        .split(/[\n,]/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      onAddVideos(urls);
    }

    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-5">
      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('videos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'videos'
              ? 'bg-red-600 text-white'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Link className="w-4 h-4" />
          Links de Vídeos
        </button>
        <button
          onClick={() => setMode('playlist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'playlist'
              ? 'bg-red-600 text-white'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <ListVideo className="w-4 h-4" />
          Playlist
        </button>
      </div>

      {/* Input area */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          mode === 'videos'
            ? 'Cole os links dos vídeos do YouTube (um por linha ou separados por vírgula):\n\nhttps://youtube.com/watch?v=...\nhttps://youtu.be/...'
            : 'Cole o link da playlist do YouTube:\n\nhttps://youtube.com/playlist?list=...'
        }
        rows={mode === 'videos' ? 5 : 3}
        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-red-500/50 resize-y"
        disabled={isProcessing}
      />

      {/* Actions */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-[var(--text-secondary)]">
          {mode === 'videos'
            ? 'Ctrl+Enter para adicionar'
            : 'Ctrl+Enter para carregar playlist'}
        </p>
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isProcessing}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processando...
            </>
          ) : mode === 'videos' ? (
            <>
              <Plus className="w-4 h-4" />
              Adicionar Vídeos
            </>
          ) : (
            <>
              <ListVideo className="w-4 h-4" />
              Carregar Playlist
            </>
          )}
        </button>
      </div>
    </div>
  );
}
