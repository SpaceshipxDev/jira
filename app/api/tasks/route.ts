import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: Request) {
  const { columnId, title, manufacturingKey, labels, priority, type } = await req.json();
  const id = crypto.randomUUID();
  const positionStmt = db.prepare('SELECT COALESCE(MAX(position) + 1, 0) as pos FROM tasks WHERE columnId = ?');
  const { pos } = positionStmt.get(columnId) as any;
  db.prepare(`INSERT INTO tasks (id, title, manufacturingKey, labels, priority, type, columnId, position)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, title, manufacturingKey, JSON.stringify(labels || []), priority || null, type || null, columnId, pos);
  return NextResponse.json({ id, title, manufacturingKey, labels: labels || [], priority, type, isChecked: false });
}
