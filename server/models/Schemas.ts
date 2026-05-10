export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  picture?: string;
  role: 'Student' | 'Admin';
  streak: number;
  last_active: Date;
  productivity_score: number;
  created_at: Date;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  subject: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'InProgress' | 'Completed';
  due_date?: Date;
  estimated_time?: number;
  completed_at?: Date;
  created_at: Date;
}

export interface StudyPlan {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  schedule: any;
  is_ai: boolean;
  created_at: Date;
}

export interface PomodoroSession {
  id: number;
  user_id: number;
  subject?: string;
  duration?: number;
  type: 'Focus' | 'ShortBreak' | 'LongBreak';
  created_at: Date;
}
