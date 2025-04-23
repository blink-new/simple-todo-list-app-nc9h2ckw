
import { useState, useEffect, useRef } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

function getInitialTodos(): Todo[] {
  try {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setTodosToStorage(todos: Todo[]) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(getInitialTodos);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTodosToStorage(todos);
  }, [todos]);

  // Animations: fade in on mount
  useEffect(() => {
    document.body.classList.add("bg-gradient-to-br", "from-blue-100", "to-purple-200", "min-h-screen");
  }, []);

  const handleAdd = () => {
    if (input.trim() === "") return;
    setTodos([
      ...todos,
      { id: Date.now().toString(), text: input.trim(), completed: false },
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleEditSave = (id: string) => {
    if (editingText.trim() === "") return;
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: editingText.trim() } : todo
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  const handleEditKey = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") handleEditSave(id);
    if (e.key === "Escape") {
      setEditingId(null);
      setEditingText("");
    }
  };

  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="flex items-center justify-center min-h-screen px-2">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/40 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text drop-shadow">
          Todo List
        </h1>
        <p className="text-center text-gray-500 mb-6">
          {todos.length === 0
            ? "Start by adding your first task!"
            : `Completed ${completedCount} of ${todos.length} tasks`}
        </p>
        <div className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 shadow transition"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKey}
            maxLength={100}
            aria-label="Add a new task"
          />
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 active:scale-95 transition font-bold"
            onClick={handleAdd}
            aria-label="Add task"
          >
            +
          </button>
        </div>
        <ul className="space-y-3 min-h-[120px]">
          {todos.length === 0 ? (
            <li className="flex flex-col items-center justify-center py-8 text-gray-400 animate-fade-in">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#e0e7ff" />
                <path d="M8 12h8M12 8v8" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="mt-2">No tasks yet. Enjoy your free time!</span>
            </li>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                className={`flex items-center gap-3 p-3 rounded-xl shadow-sm bg-white/80 border border-gray-100 transition-all group ${
                  todo.completed
                    ? "opacity-70 bg-gradient-to-r from-green-100 to-green-50"
                    : "hover:bg-blue-50"
                } animate-slide-up`}
              >
                <button
                  className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    todo.completed
                      ? "border-green-400 bg-gradient-to-br from-green-300 to-green-400"
                      : "border-gray-300 bg-white"
                  } focus:outline-none`}
                  onClick={() => handleToggle(todo.id)}
                  aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {todo.completed && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                {editingId === todo.id ? (
                  <input
                    className="flex-1 px-2 py-1 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/90"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => handleEditKey(e, todo.id)}
                    autoFocus
                    maxLength={100}
                  />
                ) : (
                  <span
                    className={`flex-1 text-lg transition-all ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800 group-hover:text-blue-700"
                    }`}
                  >
                    {todo.text}
                  </span>
                )}
                {editingId === todo.id ? (
                  <button
                    className="ml-2 px-2 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                    onClick={() => handleEditSave(todo.id)}
                    aria-label="Save edit"
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      className="ml-1 p-1 rounded-lg hover:bg-blue-100 text-blue-500 transition"
                      onClick={() => handleEdit(todo.id, todo.text)}
                      aria-label="Edit task"
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      className="ml-1 p-1 rounded-lg hover:bg-red-100 text-red-500 transition"
                      onClick={() => handleDelete(todo.id)}
                      aria-label="Delete task"
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
        <div className="mt-8 text-center text-xs text-gray-400">
          Made with <span className="text-pink-400">♥</span> by Blink
        </div>
      </div>
      <style>
        {`
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(.4,0,.2,1);
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        `}
      </style>
    </div>
  );
}