import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { todoApi } from '@/utils/axios'
import { Loader2 } from 'lucide-react'

interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  created_at: string
  priority: 'low' | 'medium' | 'high'
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [newTodo, setNewTodo] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    try {
      const data = await todoApi.getTodos()
      setTodos(data)
    } catch (error) {
      console.error('Failed to load todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return
    
    try {
      setLoading(true)
      const todo = await todoApi.createTodo({
        title: newTodo,
        priority
      })
      
      setTodos([todo, ...todos])
      setNewTodo('')
    } catch (error) {
      console.error('Failed to add todo:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    try {
      setLoading(true)
      const updatedTodo = await todoApi.updateTodo(id, {
        completed: !todo.completed
      })
      
      setTodos(todos.map(t => 
        t.id === id ? updatedTodo : t
      ))
    } catch (error) {
      console.error('Failed to update todo:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return ''
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex gap-2">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="font-mono border-2 border-black dark:border-white"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <Select 
          value={priority}
          onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}
        >
          <SelectTrigger className="w-[120px] font-mono border-2 border-black dark:border-white">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={addTodo}
          className="font-mono bg-black text-white dark:bg-white dark:text-black hover:opacity-80"
        >
          Add Task
        </Button>
      </div>

      <div className="space-y-2">
        {todos.map((todo) => (
          <Card 
            key={todo.id} 
            className={`p-4 border-2 border-black dark:border-white ${
              todo.completed ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="border-2 border-black dark:border-white"
              />
              <div className="flex-1">
                <h3 className={`font-mono text-lg ${todo.completed ? 'line-through' : ''}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
                    {todo.description}
                  </p>
                )}
              </div>
              <Badge 
                variant="outline" 
                className={`font-mono ${getPriorityColor(todo.priority)} border-2 border-current`}
              >
                {todo.priority}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}