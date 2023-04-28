import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const AppTitle = styled.h3`
  margin: 1rem 0;
  color: #ff2968
`;

const DirectoryItem = styled.button`
  min-height: 40px;
`;

const AddDirectoryItemButton = styled.button`
  margin-top: 1rem;
`;

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
  const [directoryItemName, setDirectoryItemName] = useState("");
  const [todoItemText, setTodoItemText] = useState("");
  const [directoryItems, setDirectoryItems] = useState([
    {id: 1, name: ""}
  ]);
  const [todoItems, setTodoItems] = useState([]);

  const handleDirectoryItemNameChange = (event) => {
    setDirectoryItemName(event.target.value);
  }

  const handleTodoItemTextChange = (event) => {
    setTodoItemText(event.target.value);
  }

  const handleAddDirectoryItem = (event) => {
    event.preventDefault();
    const newId = directoryItems.length > 0 ? Math.max(...directoryItems.map(item => item.id)) + 1 : 1;

    let newItem = {
      id: newId,
      name: directoryItemName
    }

    setDirectoryItems(directoryItems.concat(newItem));
    setDirectoryItemName("");
  }

  const handleAddTodoItem = (event) => {
    event.preventDefault();

    let newItem = {
      id: Date.now(),
      text: todoItemText,
      done: false
    };

    setTodoItems(todoItems.concat(newItem));
    setTodoItemText("");
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

  const handleDeleteDoneTodoItems = (itemId) => {
    let remainingItems = todoItems.filter(item => {
      return !item.done
    });

    setTodoItems([].concat(remainingItems));
  }

  const doneTodoItemsExist = (items) => {
    if (items.filter(item => {return item.done}).length > 0) {
      return true;
    }
  }

  return (
    <div class="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AppTitle>TO DO LIST</AppTitle>
        </div>
        <div className="col-md-3">
          <div className="row">
            <div className="col-md-8">
              <DirectoryItemNameInput placeholder="List Name" onChange={handleDirectoryItemNameChange}/>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-2">
          <Directory directoryItemName={directoryItemName} directoryItems={directoryItems} handleAddDirectoryItem={handleAddDirectoryItem}/>
        </div>
        <div className="col-md-3">
          <Editor 
            todoItemText={todoItemText} 
            handleDeleteDoneTodoItems={handleDeleteDoneTodoItems} 
            doneTodoItemsExist={doneTodoItemsExist} 
            todoItems={todoItems} 
            handleToggleTodoItem={handleToggleTodoItem} 
            handleDeleteTodoItem={handleDeleteTodoItem} 
            handleTodoItemTextChange={handleTodoItemTextChange} 
            handleAddTodoItem={handleAddTodoItem}>
          </Editor>
        </div>
      </div>
    </div>
  );
}

const Directory = (props) => {
  return (
    <div class="list-group">
      {props.directoryItems.map((item) => (
        <DirectoryItem className="btn btn-secondary active" active >{props.directoryItemName}</DirectoryItem>
      ))}
      <AddDirectoryItemButton className="btn btn-primary" onClick={props.handleAddDirectoryItem}>
        <i class="bi bi-journal-plus" />
      </AddDirectoryItemButton>
    </div>
  );
}

const Editor = (props) => {
  return (
    <>
      <div className="row">
      <div className="col-md-8">
        <button className="btn btn-danger btn-block" onClick={props.handleDeleteDoneTodoItems} disabled={!props.doneTodoItemsExist(props.todoItems)}>
          Remove Done items
        </button>
      </div>
      <div className="col-md-8">
        <Todos items={props.todoItems} onToggleTodoItem={props.handleToggleTodoItem} onDeleteTodoItem={props.handleDeleteTodoItem} />
      </div>
    </div>
    <form className="row">
      <div className="col-md-8">
        <input type="text" className="form-control" onChange={props.handleTodoItemTextChange} value={props.todoItemText} />
      </div>
      <div className="col-md-4">
        <button className="btn btn-primary" onClick={props.handleAddTodoItem} disabled={!props.todoItemText}>
          {"Add #" + (props.todoItems.length + 1)}
        </button>
      </div>
    </form>
  </>
  );
}

const TodoItem = (props) => {
  const [listItem, setListItem] = useState(null);

  const toggleItemStatus = () => {
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
        <input type="checkbox" className="form-check-input" onChange={toggleItemStatus} /> {props.text}
      </label>
      <button type="button" className="btn btn-danger btn-sm" onClick={deleteItem}>x</button>
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
