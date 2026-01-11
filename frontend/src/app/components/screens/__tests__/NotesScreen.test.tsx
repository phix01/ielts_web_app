// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import NotesScreen from '../NotesScreen';
import { notesService } from '../../../services/notesService';
import { vi } from 'vitest';

vi.mock('../../../services/notesService', () => ({
  notesService: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

// polyfill localStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, val: string) => { store[key] = String(val); },
    removeItem: (key: string) => delete store[key],
    clear: () => { store = {}; }
  };
})();

// @ts-ignore
global.localStorage = localStorageMock;

const mockNotes = [
  { id: 1, userId: 1, title: 'First', content: 'Hello', isPublic: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

describe('NotesScreen', () => {
  beforeEach(() => {
    (notesService.list as any).mockResolvedValue(mockNotes);
  });

  it('renders list and opens editor on click', async () => {
    render(<NotesScreen onNavigate={() => {}} />);
    await waitFor(() => expect(notesService.list).toHaveBeenCalled());

    expect(screen.getByText('First')).toBeInTheDocument();

    // open editor by clicking
    fireEvent.click(screen.getByText('First'));
    expect(await screen.findByDisplayValue('First')).toBeInTheDocument();

    // modify title and save
    fireEvent.change(screen.getByDisplayValue('First'), { target: { value: 'Updated' } });
    (notesService.update as any).mockResolvedValue({ ...mockNotes[0], title: 'Updated' });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => expect(notesService.update).toHaveBeenCalled());
  });
});
