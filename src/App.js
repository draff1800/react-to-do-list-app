import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const AppWrapper = styled.div`
  min-height: 99vh;
  min-width: 99vw;
  background: linear-gradient(to bottom right, #FFFFFF, #F0F0F0);
`;

const AppTitle = styled.h3`
  margin: 1rem 0;
  color: #333333;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const DirectoryItem = styled.div`
  margin: 0.3rem 0;
  min-height: 40px;
  border: 2px solid #ced4da;
  background-color: ${({ active }) => (active ? '#d1d1d1' : '#fff')};
  color: #495057;
  padding: 0.375rem 0.75rem;
  display: inline-flex;
  align-items: center;
  border-radius: 0.25rem;
  overflow: hidden;
  cursor: pointer;

  i.bi {
    margin-left: auto;
    cursor: pointer;
  
    &:hover {
      color: #dc3545;
    }
  }
`;

const AddDirectoryItemButton = styled.button`
  margin-top: 1rem;
  background: linear-gradient(to bottom right, #0077CC, #005299);
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

const AddTodoItemButton = styled.button`
  background: linear-gradient(to bottom right, #0077CC, #005299);
`;

const RemoveDoneItemsButton = styled.button`
  background: linear-gradient(to bottom right, #FF4D4D, #BF2E2E);
`

const TodoItemList = styled.ul`
  padding-left: 0;
  margin-top: 1rem;
  overflow: hidden;

  li.todoitem {
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
    }
  }
`;

const TodoApp = () => {
  const [directoryItems, setDirectoryItems] = useState([
    {id: 1, name: "", active: true}
  ]);
  const [todoItems, setTodoItems] = useState([]);

  const activeDirectoryItem = directoryItems.find(item => item.active);

  const handleRenameDirectoryItem = (event, itemId) => {
    let updatedItems = directoryItems.map(item => {
      if (itemId === item.id) item.name = event.target.value;
      return item;
    });

    setDirectoryItems(updatedItems);
  }

  const handleAddDirectoryItem = (event) => {
    event.preventDefault();
    const newId = Math.max(...directoryItems.map(item => item.id)) + 1

    let newItem = {
      id: newId,
      name: "",
      active: true
    }

    let updatedItems = directoryItems.map(item => {
      if (item.active) item.active = !item.active;
      return item;
    }).concat(newItem);

    setDirectoryItems(updatedItems);
  }

  const handleDeleteDirectoryItem = (id) => {
    let remainingDirectoryItems = directoryItems.filter(item => item.id !== id);
    const remainingTodoItems = todoItems.filter(item => item.directoryId !== id);

    const deletedItemIndex = directoryItems.findIndex(item => item.id === id);
    const isDeletingActiveDirectory = directoryItems[deletedItemIndex].active;
  
    if (isDeletingActiveDirectory) {
      const newActiveIndex = deletedItemIndex > 0 ? deletedItemIndex - 1 : 0;
      remainingDirectoryItems = remainingDirectoryItems.map((item, index) => {
        return index === newActiveIndex ? { ...item, active: true } : item;
      });
    }
  
    setDirectoryItems(remainingDirectoryItems);
    setTodoItems(remainingTodoItems);
  };

  const handleChangeActiveDirectoryItem = (itemId) => {
    const updatedItems = directoryItems.map(item => {
      if (item.active || itemId === item.id) {
        return { ...item, active: !item.active };
      }
  
      return item;
    });
  
    setDirectoryItems(updatedItems);
  };

  const handleAddTodoItem = (event, text) => {
    event.preventDefault();

    let newItem = {
      id: Date.now(),
      directoryId: activeDirectoryItem.id,
      text: text,
      done: false
    };

    setTodoItems(todoItems.concat(newItem));
  }

  const handleDeleteTodoItem = (itemId) => {
    let remainingItems = todoItems.filter(item => {
      return item.id !== itemId;
    });

    setTodoItems(remainingItems);
  }

  const handleDeleteDoneTodoItems = () => {
    let remainingItems = todoItems.filter(item => {
      return !item.done || (item.directoryId !== activeDirectoryItem.id)
    });

    setTodoItems([].concat(remainingItems));
  }

  const handleToggleTodoItem = (itemId) => {
    let updatedItems = todoItems.map(item => {
      if (itemId === item.id)
        item.done = !item.done;

      return item;
    });

    setTodoItems(updatedItems);
  }

  return (
    <AppWrapper className="container">
      <div className="row">
        <div className="col-md-2">
          <AppTitle>To-Do Lists</AppTitle>
          <Directory 
            directoryItems={directoryItems}
            activeDirectoryItem={activeDirectoryItem}
            handleAddDirectoryItem={handleAddDirectoryItem}
            handleDeleteDirectoryItem={handleDeleteDirectoryItem}
            handleChangeActiveDirectoryItem={handleChangeActiveDirectoryItem}
          />
        </div>
        <div className="col-md-5">
          <Editor 
            activeDirectoryItem={activeDirectoryItem}
            handleRenameDirectoryItem={handleRenameDirectoryItem}
            todoItems={todoItems} 
            handleAddTodoItem={handleAddTodoItem}
            handleDeleteTodoItem={handleDeleteTodoItem} 
            handleDeleteDoneTodoItems={handleDeleteDoneTodoItems}
            handleToggleTodoItem={handleToggleTodoItem} 
          />
        </div>
      </div>
    </AppWrapper>
  );
}

const Directory = (props) => {
  const directoryItemIsActive = (directoryId) => { return (directoryId === props.activeDirectoryItem.id); }
  const oneItemLeft = props.directoryItems.length === 1;

  return (
    <div className="list-group">
      {props.directoryItems.map((item) => (
        <DirectoryItem 
          key={item.id} 
          active={item.active} 
          onClick={() => {if (!directoryItemIsActive(item.id)) props.handleChangeActiveDirectoryItem(item.id)}}
        >
          {item.name}
          {!oneItemLeft && <i 
            className="bi bi-trash" 
            onClick={(e) => {e.stopPropagation(); props.handleDeleteDirectoryItem(item.id)}}
          />}
        </DirectoryItem>
      ))}

      <AddDirectoryItemButton className="btn btn-primary" onClick={props.handleAddDirectoryItem}>
        <i className="bi bi-journal-plus" />
      </AddDirectoryItemButton>
    </div>
  )
}

const Editor = (props) => {
  const [todoItemText, setTodoItemText] = useState("");

  const localTodoItems = props.todoItems.filter(
    item => item.directoryId === props.activeDirectoryItem.id
  );

  useEffect(() => {
    setTodoItemText("");
  }, [props.activeDirectoryItem, props.todoItems]);

  const doneTodoItemsExist = (items) => {
    return (items.some(item => item.done));
  }

  return (
    <>
      <DirectoryItemNameInput 
        placeholder="List Name" 
        value={props.activeDirectoryItem.name}
        onChange={(e) => props.handleRenameDirectoryItem(e, props.activeDirectoryItem.id)}
      />

      <div className="row">
        <div className="col-md-8">
          <RemoveDoneItemsButton 
            className="btn btn-danger btn-block" 
            disabled={!doneTodoItemsExist(localTodoItems)}
            onClick={props.handleDeleteDoneTodoItems} 
          >
            Remove Done items
          </RemoveDoneItemsButton>
          <Todos 
            items={localTodoItems} 
            onClickTodoItem={props.handleToggleTodoItem} 
            onDeleteTodoItem={props.handleDeleteTodoItem} 
          />
        </div>
      </div>
      <form className="row">
        <div className="col-md-8">
          <input 
            className="form-control"
            type="text"
            value={todoItemText}
            onChange={(e) => setTodoItemText(e.target.value)}  
          />
        </div>
        <div className="col-md-4">
          <AddTodoItemButton 
            className="btn btn-primary" 
            disabled={!todoItemText}
            onClick={(e) => props.handleAddTodoItem(e, todoItemText)} 
          >
            {"Add #" + (localTodoItems.length + 1)}
          </AddTodoItemButton>
        </div>
      </form>
    </>
  );
}

const Todo = (props) => {
  const [listItem, setListItem] = useState(null);

  const toggleItemDone = () => {
    props.onClickTodoItem(props.id);
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
        <Todo 
          key={item.id} 
          id={item.id} 
          text={item.text} 
          done={item.done} 
          onClickTodoItem={props.onClickTodoItem} 
          onDeleteTodoItem={props.onDeleteTodoItem} 
        />
      ))}
    </TodoItemList>
  );
}

// ReactDOM.render(<TodoApp />, document.getElementById("app")); // Put this back in on CodePen!
export default TodoApp; // Leave this out on CodePen!
