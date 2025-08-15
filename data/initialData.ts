import { Board } from '@/types/kanban';

export const initialBoard: Board = {
  columns: [
    { id: 'todo', title: 'TO DO', tasks: [] },
    { id: 'in-progress', title: 'IN PROGRESS', tasks: [] },
    { id: 'in-review', title: 'IN REVIEW', tasks: [] },
    { id: 'done', title: 'DONE', tasks: [] },
  ],
};
