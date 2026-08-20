export interface Subsection {
  id: string;
  name: string;
}

export interface Section {
  id: string;
  name: string;
  icon: string;
  subsections: Subsection[];
}

export interface Question {
  id: string;
  sectionId: string;
  subId: string;
  question: string;
  options: string[];
  /** index into options */
  answer: number;
  /** explanation for each option, same order/length as options */
  explanations: string[];
}

export interface QuestionStat {
  timesAnswered: number;
  timesCorrect: number;
  timesWrong: number;
  lastResult: boolean | null;
  lastAnsweredAt: number;
}

export interface UserStats {
  totalAnswers: number;
  correctAnswers: number;
  questionStats: Record<string, QuestionStat>;
}

export type ReviewFilter = 'all' | 'weak' | 'recent';

export type ViewName = 'home' | 'select_category' | 'select_count' | 'quiz' | 'result' | 'history';

export interface QuizSessionResult {
  qId: string;
  isCorrect: boolean;
  userChoice: number;
}
