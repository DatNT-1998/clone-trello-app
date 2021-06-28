import React, { useEffect, useState } from 'react';
import './BoardContent.scss';
import Column from 'components/Column/Column';
import { initialData } from 'actions/initialData';
import { isEmpty } from 'lodash';
import { mapOrder } from 'utilities/sort';
const BoardContent = () => {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === 'board-1'
    );

    if (boardFromDB) {
      setBoard(boardFromDB);

      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
    }
  }, []);

  if (isEmpty(board)) {
    return <div className='not-found'>Board Not Found </div>;
  }
  return (
    <div className='board-content'>
      {columns.map((column, index) => (
        <Column key={index} column={column} />
      ))}
    </div>
  );
};

export default BoardContent;
