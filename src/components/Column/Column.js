import React, { useState } from 'react';
import Card from 'components/Card/Card';
import { Container, Draggable } from 'react-smooth-dnd';

import { mapOrder } from 'utilities/sort';
import './Column.scss';
import { Dropdown, Form } from 'react-bootstrap';
import ConfirmModal from 'components/Common/ConfirmModal';

const Column = (props) => {
  const { column, onCardDrop } = props;
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const cards = mapOrder(column.cards, column.cardOrder, 'id');

  const toggleOpenConfirmModal = () => setShowConfirmModal(!showConfirmModal);

  const onConfirmModalAction = (type) => {
    console.log(type);
    toggleOpenConfirmModal();
  };

  return (
    <div className='column'>
      <header className='column-drag-handle'>
        <div className='column-title'>
          <Form.Control
            size='sm'
            type='text'
            placeholder='Enter column title ...'
            className='input-contenteditable'
            // ref={newColumnInputRef}
            // onChange={handleTitleChange}
            value={column.title}
          />
        </div>
        <div className='column-dropdown-actions'>
          <Dropdown>
            <Dropdown.Toggle
              id='dropdown-basic'
              size='sm'
              className='dropdown-btn'
            />

            <Dropdown.Menu>
              <Dropdown.Item>Add card...</Dropdown.Item>
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
      <div className='card-list'>
        <Container
          groupName='col'
          onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
          getChildPayload={(index) => cards[index]}
          dragClass='card-ghost'
          dropClass='card-ghost-drop'
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview',
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
      </div>
      <footer>
        <div className='footer-actions'>
          <i className='fa fa-plus'>Add another card</i>
        </div>
      </footer>
      <ConfirmModal
        show={showConfirmModal}
        title='Remove Column'
        content={`Are you sure to delete ${column.title}. All related Cards will be remove`}
        onAction={onConfirmModalAction}
      />
    </div>
  );
};

export default Column;
