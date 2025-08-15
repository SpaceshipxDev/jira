'use client';

import { useState } from 'react';
import { Column, Task } from '@/types/kanban';
import { TaskCard } from './TaskCard';
import { Plus, Check, MoreHorizontal } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface KanbanColumnProps {
  column: Column;
  onToggleCheck: (taskId: string) => void;
  onAddTask: (columnId: string, task: Omit<Task, 'id'>) => void;
  isDone?: boolean;
}

const TAGS = [
  { id: 'dueSoon', text: '三天后到期', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'overdue', text: '逾期', color: 'bg-red-100 text-red-800' },
  { id: 'waixie', text: '外协', color: 'bg-blue-100 text-blue-800' },
  { id: 'daohe', text: '道禾', color: 'bg-green-100 text-green-800' },
];

export function KanbanColumn({ column, onToggleCheck, onAddTask, isDone = false }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [manufacturingKey, setManufacturingKey] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (id: string) => {
    setSelectedTags(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onAddTask(column.id, {
      title,
      manufacturingKey,
      labels: selectedTags.map(tagId => {
        const tag = TAGS.find(t => t.id === tagId)!;
        return { text: tag.text, color: tag.color };
      }),
      isChecked: false,
    });
    setTitle('');
    setManufacturingKey('');
    setSelectedTags([]);
    setShowForm(false);
  };

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
        className="min-h-[200px] flex flex-col gap-2"
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

        {/* Add Task Button or Form */}
        {column.id === 'todo' && (
          showForm ? (
            <div className="p-3 bg-white rounded-md border border-gray-200">
              <Input
                placeholder="制造编号"
                value={manufacturingKey}
                onChange={(e) => setManufacturingKey(e.target.value)}
                className="mb-2"
              />
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-2"
              />
              <div className="flex flex-wrap gap-2 mb-2">
                {TAGS.map(tag => (
                  <label key={tag.id} className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      className="h-3 w-3"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => toggleTag(tag.id)}
                    />
                    {tag.text}
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>Save</Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setTitle('');
                    setManufacturingKey('');
                    setSelectedTags([]);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="w-full text-left p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create
            </button>
          )
        )}
      </div>
    </div>
  );
}
