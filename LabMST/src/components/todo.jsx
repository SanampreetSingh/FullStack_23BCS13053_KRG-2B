import React, { useState } from "react";

const Todo = () => {
  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem("todos")) || []);
  
  const [value, setValue] = useState("");
  const [completedTodos, setCompletedTodos] = useState(JSON.parse(localStorage.getItem("completedTodos")) || []);

  const addTodo = (e) => {
    e.preventDefault();
    if (value.trim() === "") return;
    setTodos([...todos, { text: value }]);
    localStorage.setItem("todos", JSON.stringify([...todos, { text: value }]));
    setValue("");
  };

  const deleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const completeTodo = (index) => {
    const newTodos = [...todos];
    setCompletedTodos([...completedTodos, newTodos[index]]);
    newTodos.splice(index, 1);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
    localStorage.setItem("completedTodos", JSON.stringify([...completedTodos, newTodos[index]]));
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-10 px-4 bg-gray-100">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Todo List</h1>

      {/* Add Todo Section */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 mb-12">
        <h2 className="text-2xl font-semibold mb-4">Add Todo</h2>
        <form className="flex gap-2" onSubmit={addTodo}>
          <input
            className="flex-1 border border-gray-400 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Add a task..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            type="submit"
          >
            Add
          </button>
        </form>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Active Todos</h2>
          {todos.length === 0 ? (
            <p className="text-gray-500">No tasks yet.</p>
          ) : (
            todos.map((todo, index) => (
              <div
                className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2 mb-2"
                key={index}
              >
                <div className="flex gap-3 items-center">
                  <span className="font-bold">{index + 1}.</span>
                  <span>{todo.text}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md text-sm"
                    onClick={() => completeTodo(index)}
                  >
                    Complete
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-sm"
                    onClick={() => deleteTodo(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Completed Tasks</h2>
          {completedTodos.length === 0 ? (
            <p className="text-gray-500">No completed tasks yet.</p>
          ) : (
            completedTodos.map((todo, index) => (
              <div
                className="flex items-center gap-3 bg-green-100 rounded-lg px-4 py-2 mb-2 line-through"
                key={index}
              >
                <span className="font-bold">{index + 1}.</span>
                <span>{todo.text}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;
