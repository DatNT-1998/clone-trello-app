import React, { useEffect, useRef, useState } from 'react';
import Card from 'components/Card/Card';
import { Container, Draggable } from 'react-smooth-dnd';

import { cloneDeep } from 'lodash';
import { mapOrder } from 'utilities/sort';
import './Column.scss';
import { Button, Dropdown, Form } from 'react-bootstrap';
import ConfirmModal from 'components/Common/ConfirmModal';
import {
  saveContentAfterPressEnter,
  selectAllInlineText,
} from 'utilities/contenteditable';
import { MODAL_ACTION_CONFIRM } from 'utilities/constants';

const Column = (props) => {
  const { column, onCardDrop, onUpdateColumn } = props;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');
  const handleColumnTitleChange = (e) => setColumnTitle(e.target.value);

  const [newCardTitle, setNewCardTitle] = useState('');
  const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value);

  const cards = mapOrder(column.cards, column.cardOrder, 'id');

  const toggleOpenConfirmModal = () => setShowConfirmModal(!showConfirmModal);

  const [openNewCard, setOpenNewCard] = useState(false);
  const toggleOpenNewCard = () => setOpenNewCard(!openNewCard);

  const newCardTextareaRef = useRef(null);

  useEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);

  useEffect(() => {
    if (newCardTextareaRef && newCardTextareaRef.current) {
      newCardTextareaRef.current.focus();
      newCardTextareaRef.current.select();
    }
  }, [openNewCard]);

  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true,
      };

      onUpdateColumn(newColumn);
    }
    toggleOpenConfirmModal();
  };

  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle,
    };

    onUpdateColumn(newColumn);
  };

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextareaRef.current.focus();
      return;
    }

    const newCardtoAdd = {
      id: Math.random().toString(36).substr(2, 5),
      boardId: column.boardId,
      columnId: column.id,
      title: newCardTitle.trim(),
      cover: null,
    };
    let newColumn = cloneDeep(column);
    newColumn.cards.push(newCardtoAdd);
    newColumn.cardOrder.push(newCardtoAdd.id);

    onUpdateColumn(newColumn);
    setNewCardTitle('');
    toggleOpenNewCard();
  };

  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          <Form.Control
            size="sm"
            type="text"
            placeholder="Enter column title ..."
            className="input-contenteditable"
            value={columnTitle}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            onKeyDown={saveContentAfterPressEnter}
            onClick={selectAllInlineText}
            onMouseDown={(e) => e.preventDefault()}
            spellCheck="false"
            // ref={newColumnInputRef}
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              size="sm"
              className="dropdown-btn"
            />

            <Dropdown.Menu>
              <Dropdown.Item onClick={toggleOpenNewCard}>
                Add card...
              </Dropdown.Item>
              <Dropdown.Item onClick={toggleOpenConfirmModal}>
                Remove column...
              </Dropdown.Item>
              <Dropdown.Item>
                Move all cards in this column(beta)...
              </Dropdown.Item>
              <Dropdown.Item>
                Archive all cards in this column(beta)...
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          groupName="col"
          onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
          getChildPayload={(index) => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview',
          }}
          dropPlaceholderAnimationDuration={200}>
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>

        {openNewCard && (
          <div className="add-new-card-area">
            <Form.Control
              size="sm"
              as="textarea"
              rows="3"
              placeholder="Enter a title for this card ..."
              className="textarea-enter-new-card"
              ref={newCardTextareaRef}
              value={newCardTitle}
              onChange={onNewCardTitleChange}
            />
          </div>
        )}
      </div>
      <footer>
        {openNewCard && (
          <div className="add-new-card-actions">
            <Button size="sm" variant="success" onClick={addNewCard}>
              Add New Card
            </Button>
            <span className="cancel-icon">
              <i className="fa fa-trash" onClick={toggleOpenNewCard}></i>
            </span>
          </div>
        )}
        {!openNewCard && (
          <div className="footer-actions">
            <i className="fa fa-plus" onClick={toggleOpenNewCard}>
              Add another card
            </i>
          </div>
        )}
      </footer>
      <ConfirmModal
        show={showConfirmModal}
        title="Remove Column"
        content={`Are you sure to delete ${column.title}. All related Cards will be remove`}
        onAction={onConfirmModalAction}
      />
    </div>
  );
};

export default Column;
