import { Screen } from '../Dashboard';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../services/api';

interface BookReaderProps {
  itemId?: string | null;
  onBack: () => void;
}

export default function BookReaderScreen({ itemId, onBack }: BookReaderProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let url: string | null = null;

    async function fetchPdf() {
      if (!itemId) return;
      setLoading(true);
      setError(null);
      try {
        const resp = await api.get(`/books/${encodeURIComponent(itemId)}/pdf`, { responseType: 'blob' });
        if (!active) return;
        const b = resp.data as Blob;
        url = URL.createObjectURL(b);
        setBlobUrl(url);
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || 'Failed to load PDF');
      } finally {
        setLoading(false);
      }
    }

    fetchPdf();

    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
      setBlobUrl(null);
    };
  }, [itemId]);

  if (!itemId) return <div className="p-8">No book selected</div>;

  return (
    <div className="p-0 h-[calc(100vh-4rem)]">
      <div className="mb-2 p-4">
        <button className="flex items-center space-x-2 text-sm text-gray-700" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          <span>Back to books</span>
        </button>
      </div>

      <div className="h-[calc(100vh-6rem)] w-full overflow-hidden">
        {loading && <div className="p-4">Loading PDF...</div>}
        {error && <div className="p-4 text-red-600">{error}</div>}
        {!loading && !error && blobUrl && (
          <iframe title="Book Reader" src={blobUrl} className="w-full h-full" />
        )}
      </div>
    </div>
  );
}
