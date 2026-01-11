import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, FileText } from 'lucide-react';
import { Screen } from '../Dashboard';
import { notesService, NoteResponse } from '../../services/notesService';

interface NotesScreenProps {
  onNavigate: (screen: Screen, itemId?: string) => void;
}

export default function NotesScreen({ onNavigate }: NotesScreenProps) {
  const [notes, setNotes] = useState<NoteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create / Edit state
  const [showEditor, setShowEditor] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteResponse | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const list = await notesService.list();
      setNotes(list);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const clearEditor = () => {
    setSelectedNote(null);
    setTitle('');
    setContent('');
    setError(null);
  };

  const handleCreate = async () => {
    if (!title.trim()) return setError('Title is required');
    try {
      setSaving(true);
      setError(null);
      // debug
      // eslint-disable-next-line no-console
      console.debug('[NotesScreen] handleCreate - sending create request', { title, content });
      const created = await notesService.create({ title: title.trim(), content: content.trim() });
      // eslint-disable-next-line no-console
      console.debug('[NotesScreen] handleCreate - created', created);
      clearEditor();
      setShowEditor(false);
      await fetchNotes();
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[NotesScreen] handleCreate error', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to create note');
    } finally {
      setSaving(false);
    }
  };

  const selectNote = (n: NoteResponse) => {
    setSelectedNote(n);
    setTitle(n.title);
    setContent(n.content || '');
    setShowEditor(true);
    setError(null);
  };

  const handleUpdate = async () => {
    if (!selectedNote) return;
    if (!title.trim()) return setError('Title is required');
    try {
      setSaving(true);
      setError(null);
      // debug
      // eslint-disable-next-line no-console
      console.debug('[NotesScreen] handleUpdate - updating', { id: selectedNote.id, title, content });
      const updated = await notesService.update(selectedNote.id, { title: title.trim(), content: content.trim() });
      // eslint-disable-next-line no-console
      console.debug('[NotesScreen] handleUpdate - updated', updated);
      await fetchNotes();
      setShowEditor(false);
      clearEditor();
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[NotesScreen] handleUpdate error', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to update note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNote) return;
    const ok = window.confirm('Delete this note? This cannot be undone.');
    if (!ok) return;
    try {
      setDeleting(true);
      setError(null);
      await notesService.delete(selectedNote.id);
      await fetchNotes();
      setShowEditor(false);
      clearEditor();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete note');
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    if (!selectedNote) return;
    // Dynamically import jsPDF to avoid compile-time errors when dependency isn't installed yet
    try {
      // @ts-ignore - dynamic import; types available when dependency is installed
      const module = await import('jspdf');
      const { jsPDF } = module as any;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const margin = 40;
      const pageWidth = doc.internal.pageSize.getWidth();
      // Title
      doc.setFontSize(18);
      doc.text(selectedNote.title, margin, 60);
      // Content
      doc.setFontSize(12);
      const content = selectedNote.content || '';
      const split = doc.splitTextToSize(content, pageWidth - margin * 2);
      doc.text(split, margin, 90);
      const safeTitle = selectedNote.title.replace(/[^a-z0-9\-\_ ]+/gi, '').slice(0, 50) || 'note';
      const filename = `${safeTitle}.pdf`;
      doc.save(filename);
    } catch (err) {
      setError('Failed to export PDF');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center space-x-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading notes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">Notes</h1>
          <p className="text-gray-600">Personal notes you can create and reference</p>
        </div>
        <div>
          <Button onClick={() => { if (!showEditor) { clearEditor(); } setShowEditor((s) => !s); }}>
            {showEditor ? 'Cancel' : 'New Note'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {showEditor && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{selectedNote ? 'Edit note' : 'Create a new note'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Write your note here..."
              />
              <div className="flex items-center space-x-2">
                <Button onClick={selectedNote ? handleUpdate : handleCreate} disabled={saving || !title.trim()}>
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                {selectedNote && (
                  <>
                    <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                      {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                    <Button variant="ghost" onClick={handleExport}>
                      Export as PDF
                    </Button>
                  </>
                )}
                <Button variant="ghost" onClick={() => { setShowEditor(false); clearEditor(); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {notes.length === 0 ? (
        <Alert>
          <AlertDescription>No notes yet. Create one with the New Note button.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((n) => (
            <Card key={n.id} className="cursor-pointer" onClick={() => selectNote(n)}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <h3 className="font-semibold">{n.title}</h3>
                  </div>
                  <div className="text-sm text-gray-500">{new Date(n.updatedAt).toLocaleString()}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-700">
                  {n.content ? (n.content.length > 200 ? n.content.substring(0, 200) + '...' : n.content) : '—'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
