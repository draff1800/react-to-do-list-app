import React, { useState, useEffect } from 'react';
import './App.scss';

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

  const markItemCompleted = (itemId) => {
    let updatedItems = items.map(item => {
      if (itemId === item.id)
        item.done = !item.done;

      return item;
    });

    setItems(updatedItems);
  }

  const handleDeleteItem = (itemId) => {
    let updatedItems = items.filter(item => {
      return item.id !== itemId;
    });

    setItems([].concat(updatedItems));
  }

  return (
    <div>
      <h3 className="apptitle">TO DO LIST</h3>
      <div className="row">
        <div className="col-md-3">
          <TodoList items={items} onItemCompleted={markItemCompleted} onDeleteItem={handleDeleteItem} />
        </div>
      </div>
      <form className="row">
        <div className="col-md-3">
          <input type="text" className="form-control" onChange={handleTextChange} value={text} />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary" onClick={handleAddItem} disabled={!text}>{"Add #" + (items.length + 1)}</button>
        </div>
      </form>
    </div>
  );
}

const TodoItem = (props) => {
  const [listItem, setListItem] = useState(null);

  const markCompleted = (event) => {
    props.onItemCompleted(props.id);
  }

  const deleteItem = (event) => {
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

  let itemClass = "form-check todoitem " + (props.completed ? "done" : "undone");

  return (
    <li className={itemClass} ref={li => setListItem(li)}>
      <label className="form-check-label">
        <input type="checkbox" className="form-check-input" onChange={markCompleted} /> {props.text}
      </label>
      <button type="button" className="btn btn-danger btn-sm" onClick={deleteItem}>x</button>
    </li>
  );
}

const TodoList = (props) => {
  return (
    <ul className="todolist">
      {props.items.map(item => (
        <TodoItem key={item.id} id={item.id} text={item.text} completed={item.done} onItemCompleted={props.onItemCompleted} onDeleteItem={props.onDeleteItem} />
      ))}
    </ul>
  );
}

// ReactDOM.render(<TodoApp />, document.getElementById("app")); // Put this back in on CodePen!
export default TodoApp; // Leave this out on CodePen!
