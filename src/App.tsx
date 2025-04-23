
import { useState, useEffect } from 'react'
import { PlusCircle, CheckCircle2, Circle, Trash2, Edit, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Checkbox } from './components/ui/checkbox'

interface Todo {
  id: string
  text: string
  completed: boolean
  isEditing: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : []
  })
  const [newTodo, setNewTodo] = useState('')
  const [editText, setEditText] = useState('')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim() === '') {
      toast.error('Task cannot be empty')
      return
    }
    
    const newTask: Todo = {
      id: crypto.randomUUID(),
      text: newTodo,
      completed: false,
      isEditing: false
    }
    
    setTodos([...todos, newTask])
    setNewTodo('')
    toast.success('Task added')
  }

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
    toast.success('Task deleted')
  }

  const startEditing = (id: string, text: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, isEditing: true } : { ...todo, isEditing: false }
      )
    )
    setEditText(text)
  }

  const saveEdit = (id: string) => {
    if (editText.trim() === '') {
      toast.error('Task cannot be empty')
      return
    }
    
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, text: editText, isEditing: false } : todo
      )
    )
    toast.success('Task updated')
  }

  const handleKeyDown = (e: React.KeyboardEvent, id?: string) => {
    if (e.key === 'Enter') {
      if (id) {
        saveEdit(id)
      } else {
        addTodo()
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 flex flex-col items-center py-12 px-4">
      <Card className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 shadow-xl border-0 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">
            My Todo List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-blue-200 focus:border-blue-400 transition-all"
            />
            <Button 
              onClick={addTodo}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-3">
            {todos.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400 animate-fade-in">
                <p>No tasks yet. Add one above!</p>
              </div>
            ) : (
              todos.map((todo) => (
                <div 
                  key={todo.id} 
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    todo.completed 
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30' 
                      : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
                  } hover:shadow-md animate-fade-in`}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="mr-2" onClick={() => toggleComplete(todo.id)}>
                      <Checkbox 
                        checked={todo.completed}
                        onCheckedChange={() => toggleComplete(todo.id)}
                        className="border-blue-400 data-[state=checked]:bg-blue-500"
                      />
                    </div>
                    
                    {todo.isEditing ? (
                      <Input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, todo.id)}
                        className="flex-1 border-blue-200"
                        autoFocus
                      />
                    ) : (
                      <span 
                        className={`flex-1 truncate ${
                          todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-1 ml-2">
                    {todo.isEditing ? (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => saveEdit(todo.id)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        disabled={todo.completed}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => deleteTodo(todo.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {todos.length > 0 && (
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
              {todos.filter(t => t.completed).length} of {todos.length} tasks completed
            </div>
          )}
        </CardContent>
      </Card>
      
      <footer className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Your tasks are saved in your browser's local storage.</p>
      </footer>
    </div>
  )
}

export default App