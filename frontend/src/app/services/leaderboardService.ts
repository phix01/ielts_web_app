import api from './api';

export interface LeaderboardEntry {
  username: string;
  points: number;
}

export const leaderboardService = {
  async listLeaderboard(): Promise<LeaderboardEntry[]> {
    const resp = await api.get('/leaderboard');
    return resp.data || [];
  }
};
