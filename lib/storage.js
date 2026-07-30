export function exportLists({ watchlist, watched }) {
  const blob = new Blob([JSON.stringify({ watchlist, watched, exportedAt: Date.now() }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `indrisma-lists-${new Date().toISOString().slice(0, 10)}.json`;
  a.click(); URL.revokeObjectURL(url);
}

export function importLists(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        resolve({ watchlist: Array.isArray(data.watchlist) ? data.watchlist : [], watched: Array.isArray(data.watched) ? data.watched : [] });
      } catch (e) { reject(new Error('Invalid JSON file')); }
    };
    r.onerror = () => reject(new Error('Could not read file'));
    r.readAsText(file);
  });
}