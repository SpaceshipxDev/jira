'use client';

import { Column, Task } from '@/types/kanban';
import { TaskCard } from './TaskCard';
import { Plus, Check, MoreHorizontal } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps {
  column: Column;
  onToggleCheck: (taskId: string) => void;
  onAddTask: (columnId: string) => void;
  isDone?: boolean;
}

export function KanbanColumn({ column, onToggleCheck, onAddTask, isDone = false }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex-1 min-w-[280px] max-w-[350px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600 uppercase">
            {column.title}
          </span>
          <span className="text-xs text-gray-500">
            {column.count ?? column.tasks.length}
          </span>
          {isDone && (
            <Check className="h-4 w-4 text-green-600" />
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className="min-h-[200px]"
      >
        <SortableContext
          items={column.tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleCheck={onToggleCheck}
            />
          ))}
        </SortableContext>

        {/* Add Task Button */}
        {column.id === 'todo' && (
          <button
            onClick={() => onAddTask(column.id)}
            className="w-full text-left p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create
          </button>
        )}
      </div>
    </div>
  );
}
