import { useState, useCallback } from 'react';
import type { VideoEntry } from './types';
import {
  fetchTranscript,
  resolvePlaylist,
  extractVideoId,
  isPlaylistUrl,
  parseVideoUrls,
} from './services/api';
import Header from './components/Header';
import UrlInput from './components/UrlInput';
import VideoList from './components/VideoList';
import TranscriptViewer from './components/TranscriptViewer';
import ExportPanel from './components/ExportPanel';

export default function App() {
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const doneCount = videos.filter((v) => v.status === 'done').length;
  const selectedVideo = videos.find((v) => v.id === selectedId);

  // Add individual video URLs
  const handleAddVideos = useCallback((urls: string[]) => {
    const parsed = parseVideoUrls(urls.join('\n'));
    const newEntries: VideoEntry[] = parsed
      .filter((p) => !videos.some((v) => v.id === p.id))
      .map((p) => ({ ...p, status: 'pending' as const }));

    if (newEntries.length > 0) {
      setVideos((prev) => [...prev, ...newEntries]);
    }
  }, [videos]);

  // Add playlist URL - resolve and add all videos
  const handleAddPlaylist = useCallback(async (url: string) => {
    if (!isPlaylistUrl(url)) {
      // Maybe it's a single video URL with a list param - try as single
      const videoId = extractVideoId(url);
      if (videoId) {
        handleAddVideos([url]);
        return;
      }
      return;
    }

    setIsProcessing(true);

    try {
      const result = await resolvePlaylist(url);
      const newEntries: VideoEntry[] = result.videos
        .filter((v) => !videos.some((existing) => existing.id === v.id))
        .map((v) => ({
          id: v.id,
          url: v.url,
          title: v.title,
          thumbnail: v.thumbnail,
          duration: v.duration,
          status: 'pending' as const,
        }));

      if (newEntries.length > 0) {
        setVideos((prev) => [...prev, ...newEntries]);
      }
    } catch (err) {
      console.error('Failed to resolve playlist:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [videos, handleAddVideos]);

  // Fetch transcript for a single video
  const fetchSingleTranscript = useCallback(async (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, status: 'loading' as const, error: undefined } : v))
    );

    try {
      const result = await fetchTranscript(videoId);
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId
            ? {
                ...v,
                status: 'done' as const,
                transcript: result.segments,
                language: result.language,
                title: result.title || v.title,
              }
            : v
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId ? { ...v, status: 'error' as const, error: message } : v
        )
      );
    }
  }, []);

  // Fetch all pending transcripts
  const handleFetchAll = useCallback(async () => {
    const pending = videos.filter((v) => v.status === 'pending');
    // Process sequentially to avoid rate limiting
    for (const video of pending) {
      await fetchSingleTranscript(video.id);
    }
  }, [videos, fetchSingleTranscript]);

  // Remove a video
  const handleRemove = useCallback((id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  // Clear all videos
  const handleClearAll = useCallback(() => {
    setVideos([]);
    setSelectedId(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header videoCount={videos.length} doneCount={doneCount} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="space-y-6">
          {/* URL Input Section */}
          <UrlInput
            onAddVideos={handleAddVideos}
            onAddPlaylist={handleAddPlaylist}
            isProcessing={isProcessing}
          />

          {/* Content Area */}
          {videos.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Video List */}
              <div className="lg:col-span-1 space-y-4">
                <VideoList
                  videos={videos}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onRemove={handleRemove}
                  onRetry={fetchSingleTranscript}
                  onFetchAll={handleFetchAll}
                  onClearAll={handleClearAll}
                />

                <ExportPanel videos={videos} selectedId={selectedId} />
              </div>

              {/* Right: Transcript Viewer */}
              <div className="lg:col-span-2">
                {selectedVideo && selectedVideo.status === 'done' ? (
                  <TranscriptViewer video={selectedVideo} />
                ) : (
                  <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-12 text-center">
                    <p className="text-[var(--text-secondary)] text-sm">
                      {doneCount === 0
                        ? 'Clique em "Buscar Todas" para baixar as transcrições, ou adicione mais vídeos.'
                        : 'Selecione um vídeo com transcrição para visualizar o conteúdo.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {videos.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-block bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--border)]">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Como funciona
                </h2>
                <div className="text-sm text-[var(--text-secondary)] space-y-3 text-left max-w-md">
                  <div className="flex gap-3">
                    <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    <p>Cole links de vídeos do YouTube ou o link de uma playlist completa</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    <p>Clique em "Buscar Todas" para extrair as transcrições automaticamente</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    <p>Visualize, copie ou exporte nos formatos TXT, SRT ou JSON</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-4">
        <p className="text-center text-xs text-[var(--text-secondary)]">
          YT Transcriber &mdash; Extrai transcrições disponíveis nos vídeos do YouTube
        </p>
      </footer>
    </div>
  );
}
