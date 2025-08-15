import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'kanban.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS columns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  manufacturingKey TEXT,
  labels TEXT,
  isChecked INTEGER DEFAULT 0,
  priority TEXT,
  type TEXT,
  columnId TEXT NOT NULL REFERENCES columns(id),
  position INTEGER DEFAULT 0
);
`);

const defaultColumns = [
  { id: 'todo', title: 'TO DO' },
  { id: 'in-progress', title: 'IN PROGRESS' },
  { id: 'in-review', title: 'IN REVIEW' },
  { id: 'done', title: 'DONE' }
];
const insertColumn = db.prepare('INSERT OR IGNORE INTO columns(id, title) VALUES (?, ?)');
for (const col of defaultColumns) {
  insertColumn.run(col.id, col.title);
}

export default db;
