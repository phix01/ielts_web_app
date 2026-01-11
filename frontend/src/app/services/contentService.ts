import api from './api';

// Types matching backend entities
export interface ReadingQuestion {
  id: number;
  questionText: string;
  options: string[]; // A, B, C, D options
  correctAnswer: string; // The correct option (A, B, C, or D)
  questionOrder: number;
  isInitialQuestion: boolean;
}

export interface Reading {
  id: number;
  title: string;
  level: string; // easy, medium, hard
  indicatorValue: number | null;
  type: ReadingType;
  paragraph: string | null;
  initialQuestions: string[];
  endingQuestions: string[];
  answers: string[];
  initialQuestionNumbers: string | null;
  endingQuestionNumbers: string | null;
  whatToDo: string | null;
  summary: string | null;
  extraData: boolean;
  mcqQuestions?: ReadingQuestion[]; // For MCQS type readings
  createdAt: string;
  updatedAt: string;
}

export enum ReadingType {
  SENTENCE = 'SENTENCE',
  TRUE_OR_FALSE = 'TRUE_OR_FALSE',
  HEADING_COMPLETION = 'HEADING_COMPLETION',
  SUMMARY_COMPLETION = 'SUMMARY_COMPLETION',
  PARAGRAPH_COMPLETION = 'PARAGRAPH_COMPLETION',
  MCQS = 'MCQS',
  LIST_SELECTION = 'LIST_SELECTION',
  TITLE_SELECTION = 'TITLE_SELECTION',
  CATEGORIZATION = 'CATEGORIZATION',
  ENDING_SELECTION = 'ENDING_SELECTION',
  SAQS = 'SAQS',
}

export interface Writing {
  id: number;
  title: string;
  level: string;
  indicatorValue: number | null;
  question: string | null;
  answer: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Listening {
  id: number;
  title: string;
  level: string;
  indicatorValue: number | null;
  // Section 1
  whatToDo: string | null;
  firstSectionAudio: string | null;
  firstQuestionImage: string | null;
  s1SubQuestions1: string[];
  s1SubQuestions1Bool: boolean;
  s1SubQuestions1Numbers: string | null;
  s1SubQuestions2: string[];
  s1SubQuestions2Bool: boolean;
  s1SubQuestions2Numbers: string | null;
  secondQuestionImage: string | null;
  secondQuestionImageBool: boolean;
  initialQuestionNumbers: string | null;
  answers: string[];
  // Section 2-4 fields would continue here...
  createdAt: string;
  updatedAt: string;
}

export interface Speaking {
  id: number;
  title: string;
  level: string;
  indicatorValue: number | null;
  thingsToSpeak: string[];
  vocabulary: string[];
  answer: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: number;
  quizTitle: string;
  indicatorValue: number | null;
  question: string[];
  optionsJson: string | null;
  answers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: number;
  title: string;
  imageUrl: string | null;
  time: string;
  tags: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vocabulary {
  id: number;
  word: string;
  description: string | null;
  sentence: string | null;
}

export const contentService = {
  // Readings
  getReadingsByType: async (type: string): Promise<Reading[]> => {
    const response = await api.get<Reading[]>(`/readings/type/${type}`);
    return response.data;
  },

  getReadingById: async (id: number): Promise<Reading> => {
    const response = await api.get<Reading>(`/readings/${id}`);
    return response.data;
  },

  getReadingsByLevel: async (level: string): Promise<Reading[]> => {
    const response = await api.get<Reading[]>(`/readings/level/${level}`);
    return response.data;
  },

  // Writings
  getWritings: async (): Promise<Writing[]> => {
    const response = await api.get<Writing[]>('/writings');
    return response.data;
  },

  getWritingById: async (id: number): Promise<Writing> => {
    const response = await api.get<Writing>(`/writings/${id}`);
    return response.data;
  },

  getWritingsByLevel: async (level: string): Promise<Writing[]> => {
    const response = await api.get<Writing[]>(`/writings/level/${level}`);
    return response.data;
  },

  // Listenings (expected endpoints)
  getListenings: async (): Promise<Listening[]> => {
    const response = await api.get<Listening[]>('/listenings');
    return response.data;
  },

  getListeningById: async (id: number): Promise<Listening> => {
    const response = await api.get<Listening>(`/listenings/${id}`);
    return response.data;
  },

  // Speakings (expected endpoints)
  getSpeakings: async (): Promise<Speaking[]> => {
    const response = await api.get<Speaking[]>('/speakings');
    return response.data;
  },

  getSpeakingById: async (id: number): Promise<Speaking> => {
    const response = await api.get<Speaking>(`/speakings/${id}`);
    return response.data;
  },

  // Quizzes (expected endpoints)
  getQuizzes: async (): Promise<Quiz[]> => {
    const response = await api.get<Quiz[]>('/quizzes');
    return response.data;
  },

  getQuizById: async (id: number): Promise<Quiz> => {
    const response = await api.get<Quiz>(`/quizzes/${id}`);
    return response.data;
  },

  // Blogs (expected endpoints)
  getBlogs: async (): Promise<Blog[]> => {
    const response = await api.get<Blog[]>('/blogs');
    return response.data;
  },

  getBlogById: async (id: number): Promise<Blog> => {
    const response = await api.get<Blog>(`/blogs/${id}`);
    return response.data;
  },

  // Vocabularies (expected endpoints)
  getVocabularies: async (): Promise<Vocabulary[]> => {
    const response = await api.get<Vocabulary[]>('/vocabularies');
    return response.data;
  },
};

