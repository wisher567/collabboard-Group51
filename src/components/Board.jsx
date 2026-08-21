import { useState, useEffect } from 'react';
import { getBoard } from '../api/boardApi';
import Column from './Column';


function Board({ boardId }) {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBoard() {
      setLoading(true);
      setError(null);
      try {
        const data = await getBoard(boardId);
        if (isMounted) {
          setBoard(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBoard();

    return () => {
      isMounted = false;
    };
  }, [boardId]);

  if (loading) return <div className="board-loading">Loading board…</div>;
  if (error) return <div className="board-error">Error: {error}</div>;
  if (!board) return null;

  return (
    <div className="board">
      <h1>{board.title}</h1>
      <div className="board-columns">
        {board.columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
}

export default Board;
