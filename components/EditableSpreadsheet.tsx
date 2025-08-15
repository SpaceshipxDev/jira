'use client';

import { useState } from 'react';

const ROWS = 10;
const COLS = 5;

export function EditableSpreadsheet() {
  const [data, setData] = useState<string[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(''))
  );

  const updateCell = (r: number, c: number, html: string) => {
    setData(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = html;
      return next;
    });
  };

  const handleInput = (
    r: number,
    c: number,
    e: React.FormEvent<HTMLDivElement>
  ) => {
    updateCell(r, c, e.currentTarget.innerHTML);
  };

  const handlePaste = (
    r: number,
    c: number,
    e: React.ClipboardEvent<HTMLDivElement>
  ) => {
    const { items } = e.clipboardData;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => {
          updateCell(
            r,
            c,
            `<img src="${evt.target?.result}" alt="pasted image" />`
          );
        };
        reader.readAsDataURL(file);
        return;
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse">
        <tbody>
          {data.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td
                  key={c}
                  className="border border-gray-300 min-w-[100px] min-h-[30px] p-1 align-top"
                >
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    dangerouslySetInnerHTML={{ __html: cell }}
                    onInput={e => handleInput(r, c, e)}
                    onPaste={e => handlePaste(r, c, e)}
                    className="outline-none whitespace-pre-wrap break-words"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditableSpreadsheet;
