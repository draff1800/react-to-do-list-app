import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const AppWrapper = styled.div`
  min-height: 100vh;
  min-width: 99vw;
  background: linear-gradient(to bottom right, #FFFFFF, #F0F0F0);
`;

const AppTitle = styled.h3`
  margin: 1rem 0;
  font-weight: 600;
  color: #333333;
  letter-spacing: 0.05em;
`;

const DirectoryItem = styled.button`
  margin: 0.3rem 0;
  min-height: 40px;
  border: 2px solid #ced4da;
`;

const AddDirectoryItemButton = styled.button`
  margin-top: 1rem;
  background: linear-gradient(to bottom right, #0077CC, #005299);
`;

const AddTodoItemButton = styled.button`
  background: linear-gradient(to bottom right, #0077CC, #005299);
`;

const RemoveDoneItemsButton = styled.button`
  background: linear-gradient(to bottom right, #FF4D4D, #BF2E2E);
`

const DirectoryItemNameInput = styled.input`
  border: none;
  border-bottom: 2px solid #ced4da;
  margin: 1rem 0;

  &:focus {
    outline: none;
    border-bottom: 2px solid #007bff;
  }
`;

const TodoItemList = styled.ul`
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
      border-color: #0077cc;
      background-color: #bfe3ff;
    
      &:last-child {
        border-color: #0077cc;
      }
    }

    &:last-child {
      border-bottom: 1px solid #ccc;
    }

    button.btn-danger {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: linear-gradient(to bottom right, #FF4D4D, #BF2E2E);
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
  const [directoryItems, setDirectoryItems] = useState([
    {id: 1, name: "", active: true}
  ]);
  const [todoItems, setTodoItems] = useState([]);

  const handleDirectoryItemNameChange = (event, itemId) => {
    let updatedItems = directoryItems.map(item => {
      if (itemId === item.id) 
        item.name = event.target.value;

      return item;
    });

    setDirectoryItems(updatedItems);
  }

  const handleAddDirectoryItem = (event) => {
    event.preventDefault();
    const newId = directoryItems.length > 0 ? Math.max(...directoryItems.map(item => item.id)) + 1 : 1;

    let newItem = {
      id: newId,
      name: "",
      active: true
    }

    let updatedItems = directoryItems.map(item => {
      if (item.active)
        item.active = !item.active;

      return item;
    }).concat(newItem);

    setDirectoryItems(updatedItems);
  }

  const handleAddTodoItem = (text) => {
    let newItem = {
      id: Date.now(),
      directoryId: getActiveDirectoryItem().id,
      text: text,
      done: false
    };

    setTodoItems(todoItems.concat(newItem));
  }

  const handleDirectoryItemClick = (itemId) => {
    let updatedItems = directoryItems.map(item => {
      if (item.active)
        item.active = !item.active;

      return item;
    })

    updatedItems = directoryItems.map(item => {
      if (itemId === item.id)
        item.active = !item.active;

      return item;
    });

    setDirectoryItems(updatedItems);
  }

  const handleToggleTodoItem = (itemId) => {
    let updatedItems = todoItems.map(item => {
      if (itemId === item.id)
        item.done = !item.done;

      return item;
    });

    setTodoItems(updatedItems);
  }

  const handleDeleteTodoItem = (itemId) => {
    let remainingItems = todoItems.filter(item => {
      return item.id !== itemId;
    });

    setTodoItems([].concat(remainingItems));
  }

  const handleDeleteDoneTodoItems = () => {
    let remainingItems = todoItems.filter(item => {
      return !item.done || (item.directoryId !== getActiveDirectoryItem().id)
    });

    setTodoItems([].concat(remainingItems));
  }

  const doneTodoItemsExist = (items) => {
    if (items.filter(item => {return item.done && (item.directoryId === getActiveDirectoryItem().id)}).length > 0) {
      return true;
    }
  }

  const getActiveDirectoryItem = () => {
    return directoryItems.filter(item => {return item.active})[0];
  }

  return (
    <AppWrapper className="container">
      <div className="row">
        <div className="col-md-2">
          <AppTitle>To-Do Lists</AppTitle>
          <Directory 
            directoryItems={directoryItems} 
            handleAddDirectoryItem={handleAddDirectoryItem}
            handleDirectoryItemClick={handleDirectoryItemClick}
          />
        </div>
        <div className="col-md-5">
          <Editor 
            handleDeleteDoneTodoItems={handleDeleteDoneTodoItems} 
            doneTodoItemsExist={doneTodoItemsExist} 
            todoItems={todoItems} 
            handleToggleTodoItem={handleToggleTodoItem} 
            handleDeleteTodoItem={handleDeleteTodoItem} 
            handleAddTodoItem={handleAddTodoItem}
            handleDirectoryItemNameChange={handleDirectoryItemNameChange}
            getActiveDirectoryItem={getActiveDirectoryItem}
          />
        </div>
      </div>
    </AppWrapper>
  );
}

const Directory = (props) => {
  return (
    <div className="list-group">
      {props.directoryItems.map((item) => (
        <DirectoryItem key={item.id} className={`btn btn-light ${item.active ? 'active' : ''}`} onClick={() => props.handleDirectoryItemClick(item.id)}>{item.name}</DirectoryItem>
      ))}
      <AddDirectoryItemButton className="btn btn-primary" onClick={props.handleAddDirectoryItem}>
        <i className="bi bi-journal-plus" />
      </AddDirectoryItemButton>
    </div>
  );
}

const Editor = (props) => {
  const [todoItemText, setTodoItemText] = useState("");

  const handleTodoItemTextChange = (event) => {
    setTodoItemText(event.target.value);
  }

  const handleAddTodoItem = () => {
    props.handleAddTodoItem(todoItemText);
    setTodoItemText("");
  }

  return (
    <>
      <DirectoryItemNameInput 
        placeholder="List Name" 
        onChange={(e) => props.handleDirectoryItemNameChange(e, props.getActiveDirectoryItem().id)}
        value={props.getActiveDirectoryItem().name}
      />
      <div className="row">
      <div className="col-md-8">
        <RemoveDoneItemsButton className="btn btn-danger btn-block" onClick={props.handleDeleteDoneTodoItems} disabled={!props.doneTodoItemsExist(props.todoItems)}>
          Remove Done items
        </RemoveDoneItemsButton>
      </div>
      <div className="col-md-8">
        <Todos items={props.todoItems.filter(item => item.directoryId === props.getActiveDirectoryItem().id)} onToggleTodoItem={props.handleToggleTodoItem} onDeleteTodoItem={props.handleDeleteTodoItem} />
      </div>
    </div>
    <form className="row">
      <div className="col-md-8">
        <input type="text" className="form-control" onChange={handleTodoItemTextChange} value={todoItemText} />
      </div>
      <div className="col-md-4">
        <AddTodoItemButton className="btn btn-primary" onClick={(e) => handleAddTodoItem(todoItemText)} disabled={!todoItemText}>
          {"Add #" + (props.todoItems.filter(item => {return item.directoryId === props.getActiveDirectoryItem().id}).length + 1)}
        </AddTodoItemButton>
      </div>
    </form>
  </>
  );
}

const TodoItem = (props) => {
  const [listItem, setListItem] = useState(null);

  const toggleItemDone = () => {
    props.onToggleTodoItem(props.id);
  }

  const deleteItem = () => {
    props.onDeleteTodoItem(props.id);
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
        <input type="checkbox" defaultChecked={props.done} onChange={toggleItemDone} /> {props.text}
      </label>
      <button type="button" className="btn btn-danger btn-sm" onClick={deleteItem}>
        <i className="bi bi-trash" />
      </button>
    </li>
  );
}

const Todos = (props) => {
  return (
    <TodoItemList>
      {props.items.map(item => (
        <TodoItem 
          key={item.id} 
          id={item.id} 
          text={item.text} 
          done={item.done} 
          onToggleTodoItem={props.onToggleTodoItem} 
          onDeleteTodoItem={props.onDeleteTodoItem} 
        />
      ))}
    </TodoItemList>
  );
}

// ReactDOM.render(<TodoApp />, document.getElementById("app")); // Put this back in on CodePen!
export default TodoApp; // Leave this out on CodePen!
