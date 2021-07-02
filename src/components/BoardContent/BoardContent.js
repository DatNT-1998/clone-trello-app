import React, { useCallback, useEffect, useRef, useState } from 'react';
import './BoardContent.scss';
import Column from 'components/Column/Column';
import { initialData } from 'actions/initialData';
import { isEmpty } from 'lodash';
import { mapOrder } from 'utilities/sort';
import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag } from 'utilities/utils';
import {
  Container as BootstrapContainer,
  Row,
  Col,
  Form,
  Button,
} from 'react-bootstrap';

const BoardContent = () => {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [openNewColumn, setOpenNewColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const onNewColumnTitleChange = useCallback(
    (e) => setNewColumnTitle(e.target.value),
    []
  );
  const newColumnInputRef = useRef(null);

  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === 'board-1'
    );

    if (boardFromDB) {
      setBoard(boardFromDB);

      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
    }
  }, []);

  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus();
      newColumnInputRef.current.select();
    }
  }, [openNewColumn]);

  if (isEmpty(board)) {
    return <div className='not-found'>Board Not Found </div>;
  }

  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns];
    newColumns = applyDrag(columns, dropResult);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((column) => column.id);
    newBoard.columns = newColumns;
    setColumns(newColumns);
    setBoard(newBoard);
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns];

      let currentColumn = newColumns.find((c) => c.id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map((item) => item.id);
      setColumns(newColumns);
    }
  };

  const toggleOpenNewColumn = () => setOpenNewColumn(!openNewColumn);

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus();
      return;
    }

    const newColumntoAdd = {
      id: Math.random().toString(36).substr(2, 5),
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: [],
    };

    let newColumns = [...columns];
    newColumns.push(newColumntoAdd);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((column) => column.id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
    setNewColumnTitle('');
  };

  return (
    <div className='board-content'>
      <Container
        orientation='horizontal'
        onDrop={onColumnDrop}
        getChildPayload={(index) => columns[index]}
        dragHandleSelector='.column-drag-handle'
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'cards-drop-preview',
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column column={column} onCardDrop={onCardDrop} />
          </Draggable>
        ))}
      </Container>
      <BootstrapContainer>
        {!openNewColumn && (
          <Row>
            <Col className='add-new-column' onClick={toggleOpenNewColumn}>
              <i className='fa fa-plus icon' /> Add another List
            </Col>
          </Row>
        )}
        {openNewColumn && (
          <Row>
            <Col className='enter-new-column'>
              <Form.Control
                size='sm'
                type='text'
                placeholder='Enter column title ...'
                className='input-enter-new-column'
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
              />
              <Button size='sm' variant='success' onClick={addNewColumn}>
                Add column
              </Button>
              <span className='cancel-new-column' onClick={toggleOpenNewColumn}>
                <i className='fa fa-trash'></i>
              </span>
            </Col>
          </Row>
        )}
      </BootstrapContainer>
    </div>
  );
};

export default BoardContent;
