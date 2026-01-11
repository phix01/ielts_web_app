import api from './api';

export interface NoteRequest {
  title: string;
  content?: string;
  isPublic?: boolean;
}

export interface NoteResponse {
  id: number;
  userId: number;
  title: string;
  content?: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export const notesService = {
  list: async (): Promise<NoteResponse[]> => {
    const res = await api.get<NoteResponse[]>('/notes');
    return res.data;
  },

  get: async (id: number): Promise<NoteResponse> => {
    const res = await api.get<NoteResponse>(`/notes/${id}`);
    return res.data;
  },

  create: async (req: NoteRequest): Promise<NoteResponse> => {
    // debug
    // eslint-disable-next-line no-console
    console.debug('[notesService] create', req);
    const res = await api.post<NoteResponse>('/notes', req);
    // eslint-disable-next-line no-console
    console.debug('[notesService] create response', res.status, res.data);
    return res.data;
  },

  update: async (id: number, req: NoteRequest): Promise<NoteResponse> => {
    // debug
    // eslint-disable-next-line no-console
    console.debug('[notesService] update', id, req);
    const res = await api.put<NoteResponse>(`/notes/${id}`, req);
    // eslint-disable-next-line no-console
    console.debug('[notesService] update response', res.status, res.data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
};
