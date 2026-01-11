import api from './api';

export interface MockTestResult {
  id?: number;
  takenAt?: string;
  readingBand: number;
  listeningBand: number;
  writingBand: number;
  speakingBand: number;
  overallBand?: number;
}

export const mockTestsService = {
  async list(): Promise<MockTestResult[]> {
    const resp = await api.get('/mock-tests');
    return resp.data || [];
  },
  async create(r: MockTestResult): Promise<MockTestResult> {
    const resp = await api.post('/mock-tests', r);
    return resp.data;
  },
  async delete(id: number) {
    await api.delete(`/mock-tests/${id}`);
  }
};
