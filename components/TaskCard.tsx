'use client';

import { Task } from '@/types/kanban';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  CheckSquare2,
  Square,
  MoreHorizontal,
  ChevronUp,
  ChevronsUp,
  Equal,
  ChevronDown,
  ChevronsDown
} from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

interface TaskCardProps {
  task: Task;
  onToggleCheck?: (taskId: string) => void;
}

const priorityIcons = {
  highest: { icon: ChevronsUp, color: 'text-red-600' },
  high: { icon: ChevronUp, color: 'text-red-500' },
  medium: { icon: Equal, color: 'text-orange-500' },
  low: { icon: ChevronDown, color: 'text-green-500' },
  lowest: { icon: ChevronsDown, color: 'text-green-600' }
};

export function TaskCard({ task, onToggleCheck }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const PriorityIcon = task.priority ? priorityIcons[task.priority] : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-md border border-gray-200 p-3 mb-2 cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="space-y-2">
        {/* Title */}
        <div className="text-sm text-gray-900 font-medium">
          {task.title}
        </div>

        {/* Labels */}
        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.map((label, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700"
              >
                {label.text}
              </span>
            ))}
          </div>
        )}

        {/* Bottom row with issue key, checkbox, priority, and assignee */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Checkbox */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCheck?.(task.id);
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              {task.isChecked ? (
                <CheckSquare2 className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
            </button>

            {/* Issue Key */}
            <span className="text-xs text-gray-600 font-medium">
              {task.issueKey}
            </span>

            {/* Priority Icon */}
            {PriorityIcon && (
              <PriorityIcon.icon
                className={`h-4 w-4 ${PriorityIcon.color}`}
              />
            )}
          </div>

          {/* Assignee Avatar */}
          {task.assignee && (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-gray-200">
                {task.assignee.initials || task.assignee.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </div>
  );
}
