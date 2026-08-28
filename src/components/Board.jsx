import { useState, useEffect } from 'react';
import useLocalCache from '../hooks/useLocalCache';
import { getBoard } from '../api/boardApi';
import Column from './Column';

function Board({ boardId }) {
  // 1. Instantly hydrate from whatever was last seen, so we never render blank.
  const [board, setBoard] = useLocalCache(`collabboard:board:${boardId}`, null);

  const [isSyncing, setIsSyncing] = useState(true);
  const [syncError, setSyncError] = useState(null);

  // 2. Background fetch for fresh data — cached value stays on screen
  useEffect(() => {
    let cancelled = false;

    async function loadFreshBoard() {
      setIsSyncing(true);
      setSyncError(null);
      try {
        const freshBoard = await getBoard(boardId);
        if (!cancelled) {
          setBoard(freshBoard); // updates state AND re-caches via the hook
        }
      } catch (err) {
        if (!cancelled) {
          // Network down / API error: just keep showing cached board.
          setSyncError(err.message || 'Failed to fetch fresh data');
          console.warn('Board fetch failed, showing cached state:', err);
        }
      } finally {
        if (!cancelled) setIsSyncing(false);
      }
    }

    loadFreshBoard();
    return () => {
      cancelled = true;
    };
  }, [boardId, setBoard]);

  // Only true on a first-ever load with no cache and no response yet
  if (!board && isSyncing) {
    return <div className="board-loading">Loading board…</div>;
  }

  if (!board && syncError) {
    return <div className="board-error">Error: {syncError}</div>;
  }

  if (!board) return null;

  return (
    <div className="board">
      {syncError && (
        <div className="offline-warning" style={{ color: 'orange', padding: '8px' }}>
          Offline mode: Viewing cached version
        </div>
      )}
      <h1>{board.title}</h1>
      <div className="board-columns">
        {board.columns && board.columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
}

export default Board;
