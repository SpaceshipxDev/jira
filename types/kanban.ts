export interface Task {
    id: string;
    title: string;
    description?: string;
    assignee?: {
      name: string;
      avatar?: string;
      initials?: string;
    };
    labels?: {
      text: string;
      color: string;
    }[];
    manufacturingKey: string;
    priority?: 'highest' | 'high' | 'medium' | 'low' | 'lowest';
    type?: 'task' | 'bug' | 'story';
    isChecked?: boolean;
  }
  
  export interface Column {
    id: string;
    title: string;
    tasks: Task[];
    count?: number;
  }
  
  export interface Board {
    columns: Column[];
  }
  