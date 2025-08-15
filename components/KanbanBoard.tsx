'use client';

import { useState, useEffect } from 'react';
import { Board, Column, Task } from '@/types/kanban';
import { KanbanColumn } from './KanbanColumn';
import {
  Search,
  Filter,
  UserCircle,
  Share2,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function KanbanBoard() {
  const [board, setBoard] = useState<Board>({ columns: [] });
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/board');
      const data: Board = await res.json();
      setBoard(data);
    };
    load();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Find the task being dragged
    for (const column of board.columns) {
      const task = column.tasks.find(t => t.id === active.id);
      if (task) {
        setActiveTask(task);
        break;
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find source and destination
    let sourceColumn: Column | undefined;
    let sourceTaskIndex = -1;
    let destinationColumn: Column | undefined;
    let destinationTaskIndex = -1;

    // Find source task
    for (const column of board.columns) {
      const index = column.tasks.findIndex(t => t.id === activeId);
      if (index !== -1) {
        sourceColumn = column;
        sourceTaskIndex = index;
        break;
      }
    }

    // Check if overId is a column or a task
    destinationColumn = board.columns.find(c => c.id === overId);

    if (!destinationColumn) {
      // overId is a task, find which column it belongs to
      for (const column of board.columns) {
        const index = column.tasks.findIndex(t => t.id === overId);
        if (index !== -1) {
          destinationColumn = column;
          destinationTaskIndex = index;
          break;
        }
      }
    }

    if (sourceColumn && destinationColumn) {
      const newColumns = [...board.columns];
      const sourceColIndex = newColumns.findIndex(c => c.id === sourceColumn.id);
      const destColIndex = newColumns.findIndex(c => c.id === destinationColumn.id);
      let newIndex = destinationTaskIndex;

      if (sourceColIndex === -1 || destColIndex === -1) {
        setActiveTask(null);
        return;
      }

      if (sourceColumn.id === destinationColumn.id) {
        const newTasks = arrayMove(
          newColumns[sourceColIndex].tasks,
          sourceTaskIndex,
          destinationTaskIndex === -1 ? newColumns[sourceColIndex].tasks.length - 1 : destinationTaskIndex
        );
        newColumns[sourceColIndex] = {
          ...newColumns[sourceColIndex],
          tasks: newTasks
        };
        newIndex = newTasks.findIndex(t => t.id === activeId);
      } else {
        const [movedTask] = newColumns[sourceColIndex].tasks.splice(sourceTaskIndex, 1);
        if (!movedTask) {
          setActiveTask(null);
          return;
        }
        if (destinationTaskIndex === -1) {
          newColumns[destColIndex].tasks.push(movedTask);
          newIndex = newColumns[destColIndex].tasks.length - 1;
        } else {
          newColumns[destColIndex].tasks.splice(destinationTaskIndex, 0, movedTask);
          newIndex = destinationTaskIndex;
        }
      }

      setBoard({ columns: newColumns });
      await fetch(`/api/tasks/${activeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columnId: destinationColumn.id, position: newIndex })
      });
    }

    setActiveTask(null);
  };

  const handleToggleCheck = async (taskId: string) => {
    let newChecked = false;
    setBoard(prevBoard => {
      const newColumns = prevBoard.columns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => {
          if (task.id === taskId) {
            newChecked = !task.isChecked;
            return { ...task, isChecked: newChecked };
          }
          return task;
        })
      }));
      return { columns: newColumns };
    });
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isChecked: newChecked })
    });
  };

  const handleAddTask = async (columnId: string, task: Omit<Task, 'id'>) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, columnId })
    });
    const newTask: Task = await res.json();
    setBoard(prevBoard => {
      const newColumns = prevBoard.columns.map(column =>
        column.id === columnId
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      );
      return { columns: newColumns };
    });
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search board"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 text-sm bg-gray-50 border-gray-200"
              />
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <UserCircle className="h-4 w-4" />
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">AH</AvatarFallback>
              </Avatar>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              Group
              <ChevronDown className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </Button>

            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4">
            {board.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onToggleCheck={handleToggleCheck}
                onAddTask={handleAddTask}
                isDone={column.id === 'done'}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
