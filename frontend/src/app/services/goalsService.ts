import api from './api';

export interface DailyGoal {
  id?: number;
  date?: string;
  readingMinutesTarget: number;
  listeningMinutesTarget: number;
  writingTasksTarget: number;
  vocabularyTarget: number;
  completed: boolean;
}

export const goalsService = {
  async getToday(): Promise<DailyGoal> {
    const resp = await api.get('/goals/today');
    return resp.data;
  },
  async updateToday(goal: DailyGoal): Promise<DailyGoal> {
    const resp = await api.put('/goals/today', goal);
    return resp.data;
  }
};
