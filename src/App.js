import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Title = styled.h3`
  margin: 1rem 0;
  color: #ff2968
`;

const ListNameInput = styled.input`
  border: none;
  border-bottom: 2px solid #ced4da;
  margin: 1rem 0;

  &:focus {
    outline: none;
    border-bottom: 2px solid #007bff;
  }
`;

const UnorderedList = styled.ul`
  padding-left: 0;
  margin-top: 1rem;

  li.todoitem {
    position: relative;
    margin-bottom: 0.25rem;
    padding: 0.5rem 2rem 0.5rem 0.5rem;
    border-top: 1px solid #ccc;

    &.done {
      label.form-check-label {
        color: #999;
        text-decoration: line-through;
      }
    }

    &.highlight {
      border-color: #ff2968;
      background-color: #ff8fb0;

      &:last-child {
        border-color: #ff2968;
      }
    }

    &:last-child {
      border-bottom: 1px solid #ccc;
    }

    button.btn-danger {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
    }

    label.form-check-label {
      width: 100%;

      input.form-check-input {
        margin-right: 1rem;
      }
    }
  }
`;

const TodoApp = () => {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");

  const handleTextChange = (event) => {
    setText(event.target.value);
  }

  const handleAddItem = (event) => {
    event.preventDefault();

    let newItem = {
      id: Date.now(),
      text: text,
      done: false
    };

    setItems(items.concat(newItem));
    setText("");
  }

  const handleToggleItemStatus = (itemId) => {
    let updatedItems = items.map(item => {
      if (itemId === item.id)
        item.done = !item.done;

      return item;
    });

    setItems(updatedItems);
  }

  const handleDeleteItem = (itemId) => {
    let remainingItems = items.filter(item => {
      return item.id !== itemId;
    });

    setItems([].concat(remainingItems));
  }

  const handleDeleteDoneItems = (itemId) => {
    let remainingItems = items.filter(item => {
      return !item.done
    });

    setItems([].concat(remainingItems));
  }

  const doneItemsExist = (items) => {
    if (items.filter(item => {return item.done}).length > 0) {
      return true;
    }
  }

  return (
    <div class="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <Title>TO DO LIST</Title>
        </div>
        <div className="col-md-3">
          <div className="row">
            <div className="col-md-8">
              <ListNameInput placeholder="List Name" />
            </div>
            <div className="col-md-4">
              <button className="btn btn-success">
                Save List
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-2">
        <div class="list-group">
          <button type="button" class="list-group-item list-group-item-action active">
            Cras justo odio
          </button>
          <button type="button" class="list-group-item list-group-item-action">Dapibus ac facilisis in</button>
          <button type="button" class="list-group-item list-group-item-action">Morbi leo risus</button>
          <button type="button" class="list-group-item list-group-item-action">Porta ac consectetur ac</button>
          <button type="button" class="list-group-item list-group-item-action" disabled>Vestibulum at eros</button>
        </div>
        </div>
        <div className="col-md-3">
          <div className="row">
            <div className="col-md-8">
              <button className="btn btn-danger btn-block" onClick={handleDeleteDoneItems} disabled={!doneItemsExist(items)}>
                Remove Done items
              </button>
            </div>
            <div className="col-md-8">
              <TodoList items={items} onToggleItemStatus={handleToggleItemStatus} onDeleteItem={handleDeleteItem} />
            </div>
          </div>
          <form className="row">
            <div className="col-md-8">
              <input type="text" className="form-control" onChange={handleTextChange} value={text} />
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary" onClick={handleAddItem} disabled={!text}>
                {"Add #" + (items.length + 1)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const TodoItem = (props) => {
  const [listItem, setListItem] = useState(null);

  const toggleItemStatus = () => {
    props.onToggleItemStatus(props.id);
  }

  const deleteItem = () => {
    props.onDeleteItem(props.id);
  }

  useEffect(() => {
    if (listItem) {
      listItem.classList.add("highlight");

      setTimeout(() => {
        listItem.classList.remove("highlight");
      }, 500);
    };
  }, [listItem]);

  let itemClass = "form-check todoitem " + (props.done ? "done" : "undone");

  return (
    <li className={itemClass} ref={li => setListItem(li)}>
      <label className="form-check-label">
        <input type="checkbox" className="form-check-input" onChange={toggleItemStatus} /> {props.text}
      </label>
      <button type="button" className="btn btn-danger btn-sm" onClick={deleteItem}>x</button>
    </li>
  );
}

const TodoList = (props) => {
  return (
    <UnorderedList>
      {props.items.map(item => (
        <TodoItem 
          key={item.id} 
          id={item.id} 
          text={item.text} 
          done={item.done} 
          onToggleItemStatus={props.onToggleItemStatus} 
          onDeleteItem={props.onDeleteItem} 
        />
      ))}
    </UnorderedList>
  );
}

// ReactDOM.render(<TodoApp />, document.getElementById("app")); // Put this back in on CodePen!
export default TodoApp; // Leave this out on CodePen!
