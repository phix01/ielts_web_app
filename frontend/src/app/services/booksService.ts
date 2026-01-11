import api from './api';

export interface BookItem {
  fileName: string;
  title: string;
}

export const booksService = {
  async listBooks(): Promise<BookItem[]> {
    const resp = await api.get('/books');
    // backend returns { fileName, displayTitle }
    return (resp.data || []).map((b: any) => ({ fileName: b.fileName, title: b.displayTitle }));
  }
};
