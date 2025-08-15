import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  if (body.isChecked !== undefined) {
    db.prepare('UPDATE tasks SET isChecked = ? WHERE id = ?').run(body.isChecked ? 1 : 0, id);
  }
  if (body.columnId !== undefined && body.position !== undefined) {
    const task = db.prepare('SELECT columnId, position FROM tasks WHERE id = ?').get(id) as any;
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    const oldColumn = task.columnId;
    const oldPos = task.position;
    const newColumn = body.columnId;
    const newPos = body.position as number;
    db.prepare('UPDATE tasks SET columnId = ?, position = ? WHERE id = ?').run(newColumn, newPos, id);
    if (oldColumn === newColumn) {
      if (newPos > oldPos) {
        db.prepare('UPDATE tasks SET position = position - 1 WHERE columnId = ? AND position > ? AND position <= ? AND id != ?')
          .run(newColumn, oldPos, newPos, id);
      } else if (newPos < oldPos) {
        db.prepare('UPDATE tasks SET position = position + 1 WHERE columnId = ? AND position >= ? AND position < ? AND id != ?')
          .run(newColumn, newPos, oldPos, id);
      }
    } else {
      db.prepare('UPDATE tasks SET position = position - 1 WHERE columnId = ? AND position > ?').run(oldColumn, oldPos);
      db.prepare('UPDATE tasks SET position = position + 1 WHERE columnId = ? AND position >= ?').run(newColumn, newPos);
    }
  }
  return NextResponse.json({ ok: true });
}
