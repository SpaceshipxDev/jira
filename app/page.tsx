import { KanbanBoard } from '@/components/KanbanBoard';
import { initialBoard } from '@/data/initialData';

export default function Home() {
  return (
    <main className="h-screen">
      <KanbanBoard initialData={initialBoard} />
    </main>
  );
}
