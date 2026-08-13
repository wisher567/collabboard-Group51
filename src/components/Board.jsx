import React from 'react';

import Column from './Column';

function Board({ board }) {
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