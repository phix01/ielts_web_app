import api from './api';

export interface StudyRoom {
  id: number;
  name: string;
  participantCount: number;
}

export const studyService = {
  async listStudyRooms(): Promise<StudyRoom[]> {
    const resp = await api.get('/study-rooms');
    return resp.data || [];
  }
};
