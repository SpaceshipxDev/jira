import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const columns = db.prepare('SELECT id, title FROM columns').all();
  const taskStmt = db.prepare('SELECT * FROM tasks WHERE columnId = ? ORDER BY position ASC');
  const board = {
    columns: columns.map((col: any) => ({
      id: col.id,
      title: col.title,
      tasks: taskStmt.all(col.id).map((t: any) => ({
        id: t.id,
        title: t.title,
        manufacturingKey: t.manufacturingKey,
        labels: t.labels ? JSON.parse(t.labels) : [],
        isChecked: !!t.isChecked,
        priority: t.priority || undefined,
        type: t.type || undefined,
      }))
    }))
  };
  return NextResponse.json(board);
}
