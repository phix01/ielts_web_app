import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Loader2, AlertCircle, BookOpen, ArrowLeft } from 'lucide-react';
import { Screen } from '../Dashboard';
import { booksService, BookItem } from '../../services/booksService';
import { Alert, AlertDescription } from '../ui/alert';

interface BooksScreenProps {
  onNavigate: (screen: Screen, itemId?: string) => void;
}

export default function BooksScreen({ onNavigate }: BooksScreenProps) {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await booksService.listBooks();
        setBooks(list || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load books');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return (
    <div className="p-8">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Books</h1>
        <p className="text-gray-600">Download or read offline IELTS material</p>
      </div>

      {books.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No books available.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((b) => (
            <Card key={b.fileName} className="cursor-pointer hover:shadow-lg" onClick={() => onNavigate('book-detail', b.fileName)}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-6 h-6 text-gray-700" />
                  <CardTitle>{b.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">Open to read in-app or download</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
