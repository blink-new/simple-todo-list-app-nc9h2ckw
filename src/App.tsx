
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
    document.body.classList.add(
      "bg-gradient-to-br",
      "from-indigo-100",
      "to-pink-100",
      "min-h-screen"
    );
    document.body.style.fontFamily =
      "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, 'sans-serif'";
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

  const handleEditKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string
  ) => {
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
      <div className="w-full max-w-md relative animate-float">
        {/* Glassmorphism Card */}
        <div className="absolute -inset-1 bg-gradient-to-br from-indigo-200/60 to-pink-200/60 rounded-3xl blur-2xl z-0"></div>
        <div className="relative z-10 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/40">
          <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-indigo-600 to-pink-500 text-transparent bg-clip-text drop-shadow">
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
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/80 shadow transition placeholder:text-gray-400 font-medium"
              placeholder="Add a new task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKey}
              maxLength={100}
              aria-label="Add a new task"
              style={{ fontFamily: "inherit" }}
            />
            <button
              className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 active:scale-95 transition font-bold focus:outline-none focus:ring-2 focus:ring-pink-300"
              onClick={handleAdd}
              aria-label="Add task"
            >
              <span className="text-2xl leading-none">+</span>
            </button>
          </div>
          <ul className="space-y-3 min-h-[120px]">
            {todos.length === 0 ? (
              <li className="flex flex-col items-center justify-center py-8 text-gray-400 animate-fade-in">
                {/* Animated Empty State Illustration */}
                <svg
                  width="64"
                  height="64"
                  fill="none"
                  viewBox="0 0 64 64"
                  className="animate-bounce-slow"
                >
                  <ellipse
                    cx="32"
                    cy="54"
                    rx="18"
                    ry="4"
                    fill="#f3e8ff"
                    opacity="0.7"
                  />
                  <rect
                    x="18"
                    y="18"
                    width="28"
                    height="24"
                    rx="6"
                    fill="#c7d2fe"
                  />
                  <rect
                    x="22"
                    y="24"
                    width="20"
                    height="4"
                    rx="2"
                    fill="#a5b4fc"
                  />
                  <rect
                    x="22"
                    y="32"
                    width="12"
                    height="4"
                    rx="2"
                    fill="#a5b4fc"
                  />
                  <circle
                    cx="32"
                    cy="14"
                    r="6"
                    fill="#f9a8d4"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                </svg>
                <span className="mt-4 text-base font-medium">
                  No tasks yet. Enjoy your free time!
                </span>
              </li>
            ) : (
              todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`flex items-center gap-3 p-3 rounded-xl shadow-sm bg-white/80 border border-gray-100 transition-all group ${
                    todo.completed
                      ? "opacity-70 bg-gradient-to-r from-green-100 to-green-50"
                      : "hover:bg-indigo-50"
                  } animate-slide-up`}
                >
                  {/* Custom Checkbox */}
                  <button
                    className={`w-7 h-7 flex items-center justify-center rounded-full border-2 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                      todo.completed
                        ? "border-green-400 bg-gradient-to-br from-green-300 to-green-400"
                        : "border-gray-300 bg-white"
                    }`}
                    onClick={() => handleToggle(todo.id)}
                    aria-label={
                      todo.completed ? "Mark as incomplete" : "Mark as complete"
                    }
                  >
                    <span
                      className={`block w-4 h-4 rounded-full transition-all duration-200 ${
                        todo.completed
                          ? "bg-white scale-100"
                          : "bg-transparent scale-0"
                      }`}
                    ></span>
                    {todo.completed && (
                      <svg
                        className="w-4 h-4 text-green-500 absolute"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                  {editingId === todo.id ? (
                    <input
                      className="flex-1 px-2 py-1 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/90 font-medium"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => handleEditKey(e, todo.id)}
                      autoFocus
                      maxLength={100}
                      style={{ fontFamily: "inherit" }}
                    />
                  ) : (
                    <span
                      className={`flex-1 text-lg transition-all font-medium ${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800 group-hover:text-indigo-700"
                      }`}
                      style={{ fontFamily: "inherit" }}
                    >
                      {todo.text}
                    </span>
                  )}
                  {editingId === todo.id ? (
                    <button
                      className="ml-2 px-2 py-1 rounded-lg bg-indigo-500 text-white hover:bg-pink-500 transition font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300"
                      onClick={() => handleEditSave(todo.id)}
                      aria-label="Save edit"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        className="ml-1 p-1 rounded-lg hover:bg-indigo-100 text-indigo-500 transition focus:outline-none focus:ring-2 focus:ring-pink-300"
                        onClick={() => handleEdit(todo.id, todo.text)}
                        aria-label="Edit task"
                      >
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        className="ml-1 p-1 rounded-lg hover:bg-pink-100 text-pink-500 transition focus:outline-none focus:ring-2 focus:ring-pink-300"
                        onClick={() => handleDelete(todo.id)}
                        aria-label="Delete task"
                      >
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M6 18L18 6M6 6l12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
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
      </div>
      <style>
        {`
        .animate-float {
          animation: float 4s ease-in-out infinite alternate;
        }
        @keyframes float {
          0% { transform: translateY(0px);}
          100% { transform: translateY(-10px);}
        }
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
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite cubic-bezier(.4,0,.2,1);
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-10px);}
        }
        `}
      </style>
    </div>
  );
}