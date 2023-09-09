export interface Task {
  id: string;
  title: string;
  description: string;
  locked: boolean;
  createdAt: Date;
  status: string;
  squad: string;
  user: {
    uid: string;
    avatarUrl: string;
    name: string;
  }
}